import {
  FOLLOW_UPS,
  SECTION_FILES,
  SUBSECTION_FILES,
  VERBS,
  WORKERS,
  type AgentName,
  type Line,
  type WorkerName,
} from "./script";
import { AGENT_ICONS } from "./icons";

// Canvas engine for the agent field: an orchestrator, a terminal log
// per task, and short conversations - all driven by the real page.
//
// - The Orchestrator watches which section is in view, types a plan
//   for it, and sends task packets to idle workers.
// - Every task targets a real element currently on screen. Each role
//   does what fits that element: the Writer selects a line of copy,
//   the Tester clicks a link, the Reviewer drags a measuring marquee
//   around a block, the Researcher reads down a card, the Coder parks
//   a caret on a heading. The terminal chip types what it is doing,
//   built from the element's own text, link or page file.
// - While working, an agent is anchored to its element and re-measures
//   it every frame, so it scrolls with the page. If the element leaves
//   the screen the task is dropped.
// - Sometimes a finished worker reports to a teammate, who walks over
//   and replies in a chat bubble.
// - Page workers: every task frames its real element with a selection
//   box, corner handles and a tag saying who is doing what to it
//   ("Writer · editing headline").
// - Each agent is a glowing orb with its role's lucide icon and a short
//   fading trail. Colors come only from the site's Apple palette
//   tokens: graphite orbs at rest, a black Orchestrator, accent blue for
//   anything active, and the success green kept for finished results.
// - Idle agents, and the Orchestrator, rest only where nothing is drawn
//   underneath - no text, cards or buttons - and move again when a
//   scroll brings content under them.
//
// The field can sit above or behind the content (`above`). Behind it,
// anything with an opaque background (cards, buttons) covers the
// canvas, so agents working on those stand at the element's bottom
// edge, where they stay visible. Above it, nothing is covered and they
// work on the element directly.

const TAU = Math.PI * 2;
const TYPE_CPS = 24;
const HOLD_S = 1.6;
const PACKET_SPEED = 300;
const LINE_S = 2.4;
const TYPING_DOTS_S = 0.6;
const REUSE_AFTER_MS = 25_000;
const RAIL_BREAKPOINT = 1160;
const MOBILE_BREAKPOINT = 768;
const WHITE = "#FFFFFF";
const TARGETS = "h1, h2, h3, p, li, a, button, article";
// Boxes that count as occupied when looking for a place to rest, on top
// of every visible line of text.
const SOLID =
  "img, svg, hr, button, input, textarea, article, [class*='bg-']";

const FALLBACK_SANS =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "Helvetica Neue", Arial, sans-serif';
const FALLBACK_MONO =
  'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const clean = (s: string | null) => (s ?? "").replace(/\s+/g, " ").trim();
const snippet = (s: string, n: number) =>
  s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

// Moves along a gently curved quadratic path with ease-in-out timing,
// like a hand on a trackpad. `track` re-aims the end point every frame
// so a cursor heading for an element still lands on it if the page
// scrolls mid-flight. `go` and `interrupt` replace whatever was
// pending, so there is only ever one callback chain per mover.
class Mover {
  x: number;
  y: number;
  t = 1;
  dur = 1;
  wait = 0;
  p0: Point = { x: 0, y: 0 };
  p1: Point = { x: 0, y: 0 };
  p2: Point = { x: 0, y: 0 };
  track: (() => Point) | null = null;
  onArrive: (() => void) | null = null;
  onWait: (() => void) | null = null;

  constructor(p: Point) {
    this.x = p.x;
    this.y = p.y;
  }

  go(tx: number, ty: number, speed: number, cb: (() => void) | null) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const d = Math.hypot(dx, dy);
    this.p0 = { x: this.x, y: this.y };
    this.p2 = { x: tx, y: ty };
    if (d < 1) {
      this.p1 = { ...this.p0 };
    } else {
      const bend = rand(-0.25, 0.25) * d;
      this.p1 = {
        x: (this.x + tx) / 2 - (dy / d) * bend,
        y: (this.y + ty) / 2 + (dx / d) * bend,
      };
    }
    this.t = 0;
    this.dur = Math.max(0.3, (0.3 + d / 560) / speed);
    this.track = null;
    this.onArrive = cb;
    this.wait = 0;
    this.onWait = null;
  }

  pause(seconds: number, then: () => void) {
    this.wait = Math.max(seconds, 0.0001);
    this.onWait = then;
  }

  interrupt(seconds: number, then: () => void) {
    this.t = 1;
    this.track = null;
    this.onArrive = null;
    this.pause(seconds, then);
  }

  update(dt: number) {
    if (this.wait > 0) {
      this.wait -= dt;
      if (this.wait <= 0 && this.onWait) {
        const f = this.onWait;
        this.onWait = null;
        f();
      }
      return;
    }
    if (this.t < 1) {
      if (this.track) this.p2 = this.track();
      this.t = Math.min(1, this.t + dt / this.dur);
      const e = ease(this.t);
      const u = 1 - e;
      this.x = u * u * this.p0.x + 2 * u * e * this.p1.x + e * e * this.p2.x;
      this.y = u * u * this.p0.y + 2 * u * e * this.p1.y + e * e * this.p2.y;
      if (this.t >= 1 && this.onArrive) {
        const f = this.onArrive;
        this.onArrive = null;
        f();
      }
    }
  }
}

interface Chip {
  tag: string;
  text: string;
  t: number;
  fade: number;
}

interface Candidate {
  el: HTMLElement;
  tag: string;
  text: string;
  occluder: HTMLElement | null;
}

interface Task {
  el: HTMLElement;
  // What gets measured for edges and frames: the opaque box covering
  // the element if there is one, else the element itself.
  frameEl: HTMLElement;
  occluded: boolean;
  r: DOMRect;
  fr: DOMRect;
  log: string;
  subject: string;
  // What the frame tag calls the element: headline, card, button...
  noun: string;
  lines: Box[];
  line: number;
  x0: number;
  x1: number;
  rel: Point;
  actT: number;
  duration: number;
  clicked: boolean;
}

type WorkerState =
  | "idle"
  | "awaiting"
  | "travel"
  | "act"
  | "report"
  | "talking";

interface Agent {
  name: AgentName;
  lead: boolean;
  m: Mover;
  state: WorkerState;
  task: Task | null;
  chip: Chip | null;
  // Where the agent is headed to rest, so others don't pick it too.
  rest: Point | null;
  // Recent positions, drawn as the orb's fading trail.
  trail: Point[];
}

interface Packet {
  from: Agent;
  to: Agent;
  t: number;
  kind: "task" | "result";
  dead: boolean;
}

interface Ripple {
  x: number;
  y: number;
  color: string;
  t: number;
  life: number;
}

interface Convo {
  a: Agent;
  b: Agent;
  lines: Line[];
  i: number;
  t: number;
  age: number;
  arrived: number;
}

function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    cs.getPropertyValue(name).replace(/\s+/g, " ").trim() || fallback;
  return {
    primary: v("--primary", "#000000"),
    ink: v("--foreground", "#1D1D1F"),
    inkSecondary: v("--muted-foreground", "#6E6E73"),
    surface: v("--background", WHITE),
    line: v("--border", "#D2D2D7"),
    muted: v("--muted-foreground-2", "#86868B"),
    accent: v("--accent", "#0071E3"),
    ok: v("--ok", "#34C759"),
    sans: v("--font-sans", FALLBACK_SANS),
    mono: v("--font-mono", FALLBACK_MONO),
  };
}

// Handles rgb()/rgba() and the slash-alpha forms Tailwind v4 computes
// for opacity modifiers, e.g. `oklab(1 0 0 / 0.8)`.
function backgroundAlpha(bg: string): number {
  if (!bg || bg === "transparent") return 0;
  const rgba = bg.match(/^rgba\([^)]*,\s*([\d.]+)\)$/);
  if (rgba) return Number(rgba[1]);
  const slash = bg.match(/\/\s*([\d.]+)(%?)\s*\)$/);
  if (slash) return Number(slash[1]) / (slash[2] ? 100 : 1);
  return 1;
}

// The nearest ancestor (up to <main>) that paints a background, i.e.
// the box that would hide the canvas behind it. Styles here are static,
// so results are cached per element.
const occluderCache = new WeakMap<HTMLElement, HTMLElement | null>();
function occluderOf(el: HTMLElement): HTMLElement | null {
  if (occluderCache.has(el)) return occluderCache.get(el)!;
  let found: HTMLElement | null = null;
  for (let n: HTMLElement | null = el; n && n.tagName !== "MAIN"; n = n.parentElement) {
    if (backgroundAlpha(getComputedStyle(n).backgroundColor) > 0.05) {
      found = n;
      break;
    }
  }
  occluderCache.set(el, found);
  return found;
}

// Line boxes of an element's text, relative to its own rect, merged so
// inline children on one visual line count once.
function lineBoxes(el: HTMLElement, r: DOMRect): Box[] {
  const range = document.createRange();
  range.selectNodeContents(el);
  const lines: Box[] = [];
  for (const q of range.getClientRects()) {
    if (q.width < 20 || q.height < 6) continue;
    const y = q.top - r.top;
    const hit = lines.find((b) => Math.abs(b.y - y) < 4);
    if (hit) {
      const right = Math.max(hit.x + hit.w, q.right - r.left);
      hit.x = Math.min(hit.x, q.left - r.left);
      hit.w = right - hit.x;
      hit.h = Math.max(hit.h, q.height);
    } else {
      lines.push({ x: q.left - r.left, y, w: q.width, h: q.height });
    }
  }
  lines.sort((a, b) => a.y - b.y);
  return lines.length ? lines : [{ x: 0, y: 0, w: r.width, h: r.height }];
}

function pageFile(el: HTMLElement): string {
  const section = el.closest("section[id]");
  if (!section) return "src/App.tsx";
  if (section.id === "background" || section.id === "contact") {
    const top = el.getBoundingClientRect().top;
    let label = "";
    for (const h of section.querySelectorAll("h3")) {
      if (h.getBoundingClientRect().top <= top + 1) label = clean(h.textContent).toLowerCase();
    }
    const key = Object.keys(SUBSECTION_FILES).find((k) => label.includes(k));
    if (key) return SUBSECTION_FILES[key];
  }
  return SECTION_FILES[section.id] ?? "src/App.tsx";
}

function linkDest(el: HTMLElement): string {
  const href = el.getAttribute("href") ?? "";
  if (href.startsWith("#")) return href;
  if (href.startsWith("mailto:")) return "mail";
  if (href.startsWith("tel:")) return "phone";
  try {
    const u = new URL(href, window.location.href);
    if (u.origin === window.location.origin) return u.pathname;
    return snippet(u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, ""), 30);
  } catch {
    return "";
  }
}

function nounFor(el: HTMLElement, tag: string): string {
  if (tag === "h1") return "headline";
  if (/^h[23]$/.test(tag)) return "heading";
  if (tag === "p") return "paragraph";
  if (tag === "li") return "list item";
  const solid = occluderOf(el) === el;
  if (tag === "article" || (solid && el.getBoundingClientRect().height > 80)) return "card";
  if (tag === "a" || tag === "button") return solid ? "button" : "link";
  return "block";
}

const isText = (c: Candidate) => /^(h1|h2|h3|p|li)$/.test(c.tag);
const isAction = (c: Candidate) => c.tag === "a" || c.tag === "button";

const ACCEPTS: Record<WorkerName, (c: Candidate) => boolean> = {
  Writer: (c) => isText(c) && !c.occluder && c.text.length >= 12,
  Coder: (c) => /^h[1-3]$/.test(c.tag) && !c.occluder,
  Tester: (c) => isAction(c) && c.text.length >= 2,
  Reviewer: (c) =>
    ["article", "h1", "h2", "a", "li"].includes(c.tag) && c.text.length >= 2,
  Researcher: (c) =>
    c.tag === "article" ||
    c.tag === "li" ||
    c.tag === "h3" ||
    (c.tag === "a" && /^https?:/.test(c.el.getAttribute("href") ?? "")),
};

export interface AgentFieldOptions {
  // Reduced motion: simulate a few seconds, paint one frame, stop.
  still: boolean;
  // Drawn over the page rather than under it.
  above: boolean;
}

export function createAgentField(
  canvas: HTMLCanvasElement,
  { still, above }: AgentFieldOptions
): () => void {
  const maybeCtx = canvas.getContext("2d");
  if (!maybeCtx) return () => {};
  // Re-bound as non-null: narrowing doesn't reach hoisted functions.
  const ctx: CanvasRenderingContext2D = maybeCtx;
  const tk = readTokens();

  let W = 0;
  let H = 0;
  // Below the rail breakpoint the sticky header and chip row cover the
  // top of the viewport, so nothing there counts as "on screen".
  let topSafe = 40;
  const fit = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    topSafe = W >= RAIL_BREAKPOINT ? 40 : 130;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();

  const home = (): Point => ({
    x: W * (W >= RAIL_BREAKPOINT ? 0.84 : 0.78),
    y: Math.max(topSafe + 40, H * 0.24),
  });

  const makeAgent = (name: AgentName, p: Point, lead: boolean): Agent => ({
    name,
    lead,
    m: new Mover(p),
    state: "idle",
    task: null,
    chip: null,
    rest: null,
    trail: [],
  });

  const mobile = W < MOBILE_BREAKPOINT;
  const h0 = home();
  const lead = makeAgent("Orchestrator", h0, true);
  // Workers start gathered around the lead and fan out as tasks land.
  const workers = (mobile ? WORKERS.slice(0, 3) : WORKERS).map((n, i, arr) => {
    const ang = Math.PI * (0.55 + (i / Math.max(1, arr.length - 1)) * 0.9);
    return makeAgent(
      n,
      {
        x: clamp(h0.x + Math.cos(ang) * 90, 20, W - 20),
        y: clamp(h0.y + Math.sin(ang) * 70 + 40, topSafe, H - 40),
      },
      false
    );
  });
  const all = [lead, ...workers];
  const byName = new Map(all.map((a) => [a.name, a]));
  const maxWorking = mobile ? 1 : 3;

  const claimed = new Set<HTMLElement>();
  const lastUsed = new WeakMap<HTMLElement, number>();
  let packets: Packet[] = [];
  let ripples: Ripple[] = [];
  let convo: Convo | null = null;
  let nextTask = 1.2;
  let sectionCheck = 0;
  let currentSection = "";
  let done = 0;
  let time = 0;

  const ripple = (x: number, y: number, color: string) =>
    ripples.push({ x, y, color, t: 0, life: 0.7 });

  // ---------- resting in empty space ----------

  let occupiedRects: DOMRect[] = [];
  let occupiedAge = Infinity;
  const onScreen = (r: DOMRect) =>
    r.width >= 2 && r.height >= 2 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;

  // Every visible line of text plus every solid box (cards, buttons,
  // images, pills). Re-measured at most every 0.8s.
  function occupied(): DOMRect[] {
    if (occupiedAge < 0.8) return occupiedRects;
    occupiedAge = 0;
    const out: DOMRect[] = [];
    const range = document.createRange();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.nodeValue?.trim()) continue;
      const parent = n.parentElement;
      if (!parent || !onScreen(parent.getBoundingClientRect())) continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (onScreen(r)) out.push(r);
    }
    for (const el of document.querySelectorAll<HTMLElement>(SOLID)) {
      const r = el.getBoundingClientRect();
      // Skip page-sized wrappers, which would make everything "occupied".
      if (onScreen(r) && r.width * r.height < W * H * 0.4) out.push(r);
    }
    occupiedRects = out;
    return out;
  }

  function overlap(b: Box, rects: DOMRect[]): number {
    let sum = 0;
    for (const r of rects) {
      const w = Math.min(b.x + b.w, r.right) - Math.max(b.x, r.left);
      const h = Math.min(b.y + b.h, r.bottom) - Math.max(b.y, r.top);
      if (w > 0 && h > 0) sum += w * h;
    }
    return sum;
  }

  // The area an agent covers at rest: avatar, name tag, and for the
  // Orchestrator its halo and the plan chip under the tag.
  const footprint = (a: Agent, p: Point): Box =>
    a.lead
      ? { x: p.x - 14, y: p.y - 14, w: 214, h: 92 }
      : { x: p.x - 6, y: p.y - 6, w: 136, h: 38 };

  // Scores a grid of spots: covering content costs most, crowding
  // another agent next, then distance - so the pick is the closest
  // clear spot with room around it.
  function findRest(a: Agent, near: Point): Point {
    const rects = occupied();
    const others = all
      .filter((o) => o !== a)
      .map((o) => o.rest ?? { x: o.m.x, y: o.m.y });
    const f = footprint(a, { x: 0, y: 0 });
    const gridStep = W > 900 ? 32 : 20;
    let best: Point = { x: near.x, y: near.y };
    let bestScore = Infinity;
    for (let y = topSafe - f.y + 4; y + f.y + f.h <= H - 8; y += gridStep) {
      for (let x = 8 - f.x; x + f.x + f.w <= W - 8; x += gridStep) {
        const p = { x, y };
        let crowd = 0;
        for (const o of others) {
          const d = Math.hypot(o.x - x, (o.y - y) * 1.8);
          if (d < 180) crowd += (180 - d) * 30;
        }
        const score =
          overlap(footprint(a, p), rects) * 20 + crowd + dist(p, near);
        if (score < bestScore) {
          bestScore = score;
          best = p;
        }
      }
    }
    return best;
  }

  const rest = (a: Agent, speed = 0.5) => {
    const p = findRest(a, a.m);
    a.rest = p;
    a.m.go(p.x, p.y, speed, () => settle(a));
  };

  // At rest an agent stays still, the way a cursor sits while its owner
  // reads. It only moves when the page scrolls content under it.
  const settle = (a: Agent) => {
    a.m.pause(rand(1.2, 2), () => {
      if (overlap(footprint(a, a.m), occupied()) > 40) rest(a);
      else settle(a);
    });
  };

  const idle = (a: Agent) => {
    a.state = "idle";
    a.m.pause(rand(0.6, 1.4), () => rest(a));
  };

  rest(lead, 0.6);
  // Spread out from the starting huddle before the first task lands.
  workers.forEach((w, i) => w.m.pause(0.15 + i * 0.12, () => rest(w, 0.6)));

  // ---------- targets ----------

  function candidates(): Candidate[] {
    const main = document.querySelector("main");
    if (!main) return [];
    const now = performance.now();
    const out: Candidate[] = [];
    for (const el of main.querySelectorAll<HTMLElement>(TARGETS)) {
      if (claimed.has(el)) continue;
      if (now - (lastUsed.get(el) ?? -Infinity) < REUSE_AFTER_MS) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 16 || r.height < 8) continue;
      if (r.top < topSafe || r.bottom > H - 48 || r.left < 8 || r.right > W - 8) continue;
      if (el.closest("[aria-hidden='true'], nav")) continue;
      const text = clean(el.textContent);
      if (!text) continue;
      out.push({ el, tag: el.tagName.toLowerCase(), text, occluder: above ? null : occluderOf(el) });
    }
    return out;
  }

  function buildTask(role: WorkerName, c: Candidate): Task {
    const r = c.el.getBoundingClientRect();
    const frameEl = c.occluder ?? c.el;
    const fr = frameEl.getBoundingClientRect();
    const t: Task = {
      el: c.el,
      frameEl,
      occluded: !!c.occluder,
      r,
      fr,
      log: "",
      subject: "",
      noun: nounFor(c.el, c.tag),
      lines: [],
      line: 0,
      x0: 0,
      x1: 0,
      rel: { x: 0, y: 0 },
      actT: 0,
      duration: 0,
      clicked: false,
    };
    const label = snippet(c.text, 26);
    if (role === "Writer") {
      t.lines = lineBoxes(c.el, r);
      t.line = Math.floor(Math.random() * t.lines.length);
      const ln = t.lines[t.line];
      t.x0 = ln.x;
      t.x1 = ln.x + ln.w * rand(0.45, 1);
      t.log = `edit ${c.tag} "${label}"`;
      t.subject = snippet(c.text, 22);
    } else if (role === "Coder") {
      t.lines = lineBoxes(c.el, r);
      t.line = t.lines.length - 1;
      const file = pageFile(c.el);
      t.log = `edit ${file}`;
      t.subject = file.replace("src/pages/", "");
    } else if (role === "Tester") {
      const dest = linkDest(c.el);
      t.rel = c.occluder
        ? { x: fr.width * rand(0.35, 0.65), y: fr.height - 3 }
        : { x: r.width * rand(0.3, 0.7), y: r.height * 0.55 };
      t.log = `click "${snippet(c.text, 22)}"${dest ? ` → ${dest}` : ""}`;
      t.subject = snippet(c.text, 22);
    } else if (role === "Reviewer") {
      const tag = frameEl.tagName.toLowerCase();
      t.log = `inspect <${tag}> ${Math.round(fr.width)}×${Math.round(fr.height)}`;
      t.subject = t.noun;
    } else {
      const href = c.el.getAttribute("href") ?? "";
      t.lines = c.occluder ? [] : lineBoxes(c.el, r).slice(0, 3);
      t.log = /^https?:/.test(href) ? `open ${linkDest(c.el)}` : `read "${label}"`;
      t.subject = snippet(c.text, 22);
    }
    t.duration = Math.max(2.2, t.log.length / TYPE_CPS + HOLD_S);
    return t;
  }

  // Where the cursor should be for a task right now. `p` is act
  // progress in seconds; 0 gives the point it walks to first.
  function taskPoint(role: WorkerName, t: Task, p: number): Point {
    const { r, fr } = t;
    if (role === "Writer") {
      const ln = t.lines[t.line];
      const k = ease(Math.min(1, p / 0.9));
      return { x: r.left + lerp(t.x0, t.x1, k), y: r.top + ln.y + ln.h };
    }
    if (role === "Coder") {
      const ln = t.lines[t.line];
      return { x: r.left + ln.x + ln.w + 8, y: r.top + ln.y + ln.h * 0.8 };
    }
    if (role === "Tester") return { x: fr.left + t.rel.x, y: fr.top + t.rel.y };
    if (role === "Reviewer") {
      const k = ease(Math.min(1, p / 0.8));
      return {
        x: lerp(fr.left - 6, fr.right + 6, k),
        y: lerp(fr.top - 6, fr.bottom + 6, k),
      };
    }
    // Researcher: read down the first lines, or along a card's edge.
    const k = Math.min(1, p / (t.duration * 0.85));
    if (!t.lines.length) {
      return { x: fr.left + fr.width * lerp(0.2, 0.8, k), y: fr.bottom - 3 };
    }
    const n = t.lines.length;
    const i = Math.min(n - 1, Math.floor(k * n));
    const ln = t.lines[i];
    const local = k * n - i;
    return { x: r.left + ln.x + ln.w * lerp(0.05, 0.9, local), y: r.top + ln.y + ln.h * 0.8 };
  }

  // ---------- simulation ----------

  function checkSection(dt: number) {
    sectionCheck -= dt;
    if (sectionCheck > 0) return;
    sectionCheck = 0.4;
    const probe = H * 0.4;
    let id = "";
    for (const s of document.querySelectorAll<HTMLElement>("main section[id]")) {
      const r = s.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) id = s.id;
    }
    if (!id || id === currentSection) return;
    currentSection = id;
    lead.chip = { tag: "orchestrator", text: `plan #${id}`, t: 0, fade: 1 };
    nextTask = Math.min(nextTask, 0.6);
  }

  function dispatch(dt: number) {
    nextTask -= dt;
    if (nextTask > 0) return;
    nextTask = rand(1.2, 2.4);
    const busy = workers.filter((w) => w.state !== "idle" && w.state !== "talking");
    if (busy.length >= maxWorking) return;
    const pool = candidates();
    for (const w of [...workers].sort(() => Math.random() - 0.5)) {
      if (w.state !== "idle") continue;
      const role = w.name as WorkerName;
      const options = pool.filter(ACCEPTS[role]);
      if (!options.length) continue;
      const c = pick(options);
      claimed.add(c.el);
      w.task = buildTask(role, c);
      w.state = "awaiting";
      w.rest = null;
      w.m.interrupt(Infinity, () => {});
      packets.push({ from: lead, to: w, t: 0, kind: "task", dead: false });
      return;
    }
  }

  function release(w: Agent) {
    if (w.task) {
      claimed.delete(w.task.el);
      lastUsed.set(w.task.el, performance.now());
    }
    w.task = null;
  }

  function updatePackets(dt: number) {
    for (const p of packets) {
      p.t += (dt * PACKET_SPEED) / Math.max(dist(p.from.m, p.to.m), 60);
      if (p.t < 1) continue;
      p.dead = true;
      if (p.kind === "task") {
        const w = p.to;
        const t = w.task;
        if (!t || w.state !== "awaiting") continue;
        w.state = "travel";
        const c = centerOf(w);
        ripple(c.x, c.y, tk.accent);
        const role = w.name as WorkerName;
        const target = taskPoint(role, t, 0);
        w.m.go(target.x, target.y, rand(0.75, 0.95), () => {
          w.state = "act";
          w.chip = { tag: w.name.toLowerCase(), text: t.log, t: 0, fade: 1 };
          w.m.interrupt(Infinity, () => {});
        });
        w.m.track = () => taskPoint(role, t, 0);
      } else {
        done++;
        const c = centerOf(lead);
        ripple(c.x, c.y, tk.ok);
      }
    }
    packets = packets.filter((p) => !p.dead);
  }

  function abort(w: Agent) {
    release(w);
    if (w.chip) w.chip.t = Infinity;
    idle(w);
  }

  function finish(w: Agent) {
    const role = w.name as WorkerName;
    const subject = w.task?.subject ?? "";
    release(w);
    packets.push({ from: w, to: lead, t: 0, kind: "result", dead: false });
    const f = FOLLOW_UPS[role];
    const partner = byName.get(f.partner);
    if (!convo && partner && partner.state === "idle" && subject && Math.random() < 0.4) {
      startConvo(w, partner, f.lines(subject));
    } else {
      idle(w);
    }
  }

  function updateTasks(dt: number) {
    for (const w of workers) {
      const t = w.task;
      if (!t || (w.state !== "travel" && w.state !== "act" && w.state !== "report")) continue;
      if (!t.el.isConnected) {
        abort(w);
        continue;
      }
      t.r = t.el.getBoundingClientRect();
      t.fr = t.frameEl === t.el ? t.r : t.frameEl.getBoundingClientRect();
      if (t.fr.bottom < 0 || t.fr.top > H) {
        abort(w);
        continue;
      }
      if (w.state === "travel") continue;
      const role = w.name as WorkerName;
      t.actT += dt;
      const p = taskPoint(role, t, t.actT);
      w.m.x = p.x;
      w.m.y = p.y;
      if (role === "Tester" && !t.clicked && t.actT > 0.25) {
        t.clicked = true;
        ripple(p.x, p.y, tk.accent);
      }
      if (w.state === "act" && t.actT >= t.duration) w.state = "report";
      if (w.state === "report" && w.chip && w.chip.fade <= 0) finish(w);
    }
  }

  function updateChips(dt: number) {
    for (const a of all) {
      const c = a.chip;
      if (!c) continue;
      c.t += dt;
      const holdEnd = c.text.length / TYPE_CPS + HOLD_S;
      const fading = a.lead ? c.t > holdEnd : a.state === "report" || a.state === "idle";
      if (fading) c.fade -= dt * 2.5;
      if (c.fade <= 0) {
        // Kept until the task loop has seen the fade finish.
        if (a.lead || a.state !== "report") a.chip = null;
      }
    }
  }

  function startConvo(a: Agent, b: Agent, lines: Line[]) {
    a.state = "talking";
    b.state = "talking";
    a.m.interrupt(Infinity, () => {});
    const c: Convo = { a, b, lines, i: -1, t: 0, age: 0, arrived: 1 };
    const side = a.m.x > W - 180 ? -1 : 1;
    b.m.interrupt(0, () =>
      b.m.go(
        clamp(a.m.x + side * 90, 24, W - 24),
        clamp(a.m.y + rand(-10, 10), topSafe, H - 40),
        0.9,
        () => c.arrived++
      )
    );
    convo = c;
  }

  function updateConvo(dt: number) {
    const c = convo;
    if (!c || c.arrived < 2) return;
    c.age += dt;
    c.t -= dt;
    if (c.t > 0) return;
    c.i++;
    c.age = 0;
    c.t = LINE_S;
    if (c.i < c.lines.length) return;
    idle(c.a);
    idle(c.b);
    convo = null;
  }

  function step(dt: number) {
    time += dt;
    occupiedAge += dt;
    for (const a of all) {
      a.m.update(dt);
      const last = a.trail[a.trail.length - 1];
      if (!last || dist(last, a.m) > 5) {
        a.trail.push({ x: a.m.x, y: a.m.y });
        if (a.trail.length > 12) a.trail.shift();
      } else if (a.trail.length && Math.random() < dt * 6) {
        a.trail.shift();
      }
    }
    checkSection(dt);
    dispatch(dt);
    updatePackets(dt);
    updateTasks(dt);
    updateChips(dt);
    updateConvo(dt);
    ripples.forEach((r) => (r.t += dt));
    ripples = ripples.filter((r) => r.t < r.life);
  }

  // ---------- drawing ----------

  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };

  // Places a box to the right of the orb, or flips it to the left of
  // the hotspot when it would run off the viewport.
  const placeX = (x: number, w: number, right: number) =>
    x + right + w > W - 8 ? Math.max(8, x - 6 - w) : x + right;

  const radius = (a: Agent) => (a.lead ? 13 : 10);
  // The hotspot is the orb's top-left; the orb sits just below-right.
  function centerOf(a: Agent): Point {
    const r = radius(a);
    return { x: a.m.x + 2 + r, y: a.m.y + 2 + r };
  }
  const working = (a: Agent) =>
    a.state === "travel" || a.state === "act" || a.state === "report";
  const iconPaths = new Map(
    (Object.keys(AGENT_ICONS) as AgentName[]).map((n) => [
      n,
      AGENT_ICONS[n].map((d) => new Path2D(d)),
    ])
  );

  // A palette token mixed toward white (k) or given an alpha - tints of
  // the same tokens, never new hues.
  const rgbOf = (color: string) => {
    const m = color.match(/^#([0-9a-f]{6})$/i);
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  };
  const tint = (color: string, k: number) => {
    const c = rgbOf(color);
    if (!c) return color;
    const [r, g, b] = c.map((v) => Math.round(v + (255 - v) * k));
    return `rgb(${r},${g},${b})`;
  };
  const withAlpha = (color: string, a: number) => {
    const c = rgbOf(color);
    return c ? `rgba(${c[0]},${c[1]},${c[2]},${a})` : color;
  };

  // [inner, edge, glow]: graphite at rest, black for the lead, accent
  // blue while an agent is on a task.
  function orbColors(a: Agent): [string, string, string] {
    if (working(a)) return [tint(tk.accent, 0.45), tk.accent, withAlpha(tk.accent, 0.55)];
    if (a.lead) return [tk.inkSecondary, tk.primary, "rgba(0,0,0,.35)"];
    return [tk.muted, tk.ink, "rgba(0,0,0,.25)"];
  }

  function drawTrail(a: Agent) {
    const r = radius(a);
    const n = a.trail.length;
    ctx.save();
    ctx.fillStyle = orbColors(a)[1];
    a.trail.forEach((p, i) => {
      const k = (i + 1) / (n + 1);
      ctx.globalAlpha = 0.28 * k;
      ctx.beginPath();
      ctx.arc(p.x + 2 + r, p.y + 2 + r, r * (0.2 + 0.45 * k), 0, TAU);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawOrb(a: Agent, press: number) {
    const r = radius(a) * (1 - press * 0.12);
    const { x: cx, y: cy } = centerOf(a);
    const [inner, edge, glow] = orbColors(a);
    const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, tk.surface);
    g.addColorStop(0.38, inner);
    g.addColorStop(1, edge);
    ctx.save();
    ctx.shadowColor = glow;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
    const s = r * 1.05;
    ctx.save();
    ctx.translate(cx - s / 2, cy + 0.5 - s / 2);
    ctx.scale(s / 24, s / 24);
    ctx.strokeStyle = tk.surface;
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const path of iconPaths.get(a.name) ?? []) ctx.stroke(path);
    ctx.restore();
  }

  function drawNameTag(a: Agent, text: string) {
    const r = radius(a);
    const cy = centerOf(a).y;
    ctx.save();
    ctx.font = `600 11px ${tk.sans}`;
    const w = ctx.measureText(text).width + 14;
    const h = 20;
    const x = placeX(a.m.x, w, 2 + r * 2 + 7);
    rr(x, cy - h / 2, w, h, 9);
    ctx.shadowColor = "rgba(0,0,0,.10)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = tk.surface;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = tk.line;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = tk.ink;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + 7, cy + 0.5);
    ctx.restore();
  }

  function drawChip(a: Agent, c: Chip) {
    const r = radius(a);
    const y = centerOf(a).y + 27;
    const typed = Math.min(c.text.length, Math.floor(c.t * TYPE_CPS));
    const body = c.text.slice(0, typed);
    ctx.save();
    ctx.globalAlpha = clamp(c.fade, 0, 1);
    ctx.textBaseline = "middle";
    ctx.font = `700 11.5px ${tk.mono}`;
    const tagW = ctx.measureText(c.tag + " ").width;
    ctx.font = `500 11.5px ${tk.mono}`;
    const boxW = tagW + ctx.measureText(c.text).width + 26;
    const bx = placeX(a.m.x, boxW, 2 + r * 2 + 7);
    rr(bx, y - 12, boxW, 24, 7);
    ctx.fillStyle = tk.surface;
    ctx.shadowColor = "rgba(0,0,0,.08)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 1;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = tk.line;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = `700 11.5px ${tk.mono}`;
    ctx.fillStyle = tk.ink;
    ctx.fillText(c.tag, bx + 8, y + 0.5);
    ctx.font = `500 11.5px ${tk.mono}`;
    ctx.fillStyle = tk.inkSecondary;
    ctx.fillText(body, bx + 8 + tagW, y + 0.5);
    if (typed < c.text.length || (time * 1.8) % 1 < 0.55) {
      const cx = bx + 8 + tagW + ctx.measureText(body).width + 1;
      ctx.fillStyle = tk.accent;
      ctx.fillRect(cx, y - 6.5, 6.5, 13);
    }
    ctx.restore();
  }

  const taskAlpha = (w: Agent) => (w.chip ? clamp(w.chip.fade, 0, 1) : 1);

  // Page workers: a selection frame with corner handles around the real
  // element, tagged with who is doing what to it.
  function drawFrame(w: Agent) {
    const t = w.task;
    if (!t || (w.state !== "act" && w.state !== "report")) return;
    // The Reviewer drags its own marquee first; the frame lands after.
    if (w.name === "Reviewer" && t.actT < 0.8) return;
    const a = Math.min(1, t.actT * 5) * taskAlpha(w);
    const { fr } = t;
    const pad = 6;
    const x = fr.left - pad;
    const y = fr.top - pad;
    const fw = fr.width + pad * 2;
    const fh = fr.height + pad * 2;
    ctx.save();
    ctx.globalAlpha = a * 0.05;
    ctx.fillStyle = tk.accent;
    rr(x, y, fw, fh, 10);
    ctx.fill();
    ctx.globalAlpha = a;
    ctx.strokeStyle = tk.accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    for (const [hx, hy] of [[x, y], [x + fw, y], [x, y + fh], [x + fw, y + fh]]) {
      ctx.fillStyle = tk.surface;
      ctx.fillRect(hx - 3, hy - 3, 6, 6);
      ctx.strokeRect(hx - 3, hy - 3, 6, 6);
    }
    const text = `${w.name} · ${VERBS[w.name as WorkerName]} ${t.noun}`;
    ctx.font = `600 11px ${tk.sans}`;
    const tw = ctx.measureText(text).width + 12;
    const ty = y - 24 < topSafe ? y + fh + 6 : y - 24;
    const tx = clamp(x, 8, W - tw - 8);
    rr(tx, ty, tw, 18, 6);
    ctx.fillStyle = tk.accent;
    ctx.fill();
    ctx.fillStyle = tk.surface;
    ctx.textBaseline = "middle";
    ctx.fillText(text, tx + 6, ty + 9.5);
    if (w.name === "Reviewer") {
      const dims = `${Math.round(fr.width)} × ${Math.round(fr.height)}`;
      ctx.font = `500 10px ${tk.mono}`;
      ctx.fillStyle = tk.accent;
      ctx.fillText(dims, x + fw - ctx.measureText(dims).width, ty + 9.5);
    }
    ctx.restore();
  }

  // What each role leaves inside the frame: a text selection, a caret,
  // or the Reviewer's measuring marquee while it drags.
  function drawTaskMarks(w: Agent) {
    const t = w.task;
    if (!t || (w.state !== "act" && w.state !== "report")) return;
    const alpha = taskAlpha(w);
    const { r, fr } = t;
    ctx.save();
    if (w.name === "Writer") {
      const ln = t.lines[t.line];
      const x = taskPoint("Writer", t, t.actT).x;
      ctx.globalAlpha = alpha * 0.22;
      ctx.fillStyle = tk.accent;
      ctx.fillRect(r.left + t.x0, r.top + ln.y, x - (r.left + t.x0), ln.h);
    } else if (w.name === "Coder") {
      const ln = t.lines[t.line];
      if ((time * 1.8) % 1 < 0.6) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = tk.accent;
        ctx.fillRect(r.left + ln.x + ln.w + 2, r.top + ln.y + ln.h * 0.12, 2, ln.h * 0.76);
      }
    } else if (w.name === "Reviewer" && t.actT < 0.8) {
      const x0 = fr.left - 6;
      const y0 = fr.top - 6;
      const bw = w.m.x - x0;
      const bh = w.m.y - y0;
      ctx.globalAlpha = alpha * 0.06;
      ctx.fillStyle = tk.accent;
      ctx.fillRect(x0, y0, bw, bh);
      ctx.globalAlpha = alpha * 0.9;
      ctx.setLineDash([5, 4]);
      ctx.lineDashOffset = -time * 18;
      ctx.strokeStyle = tk.accent;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x0 + 0.5, y0 + 0.5, bw, bh);
    }
    ctx.restore();
  }

  function drawRing(w: Agent) {
    const t = w.task;
    if (!t || (w.state !== "act" && w.state !== "report")) return;
    const c = centerOf(w);
    ctx.save();
    ctx.globalAlpha = 0.9 * taskAlpha(w);
    ctx.strokeStyle = tk.accent;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    const p = Math.min(1, t.actT / t.duration);
    ctx.arc(c.x, c.y, radius(w) + 7, -Math.PI / 2, -Math.PI / 2 + TAU * p);
    ctx.stroke();
    ctx.restore();
  }

  function drawPackets() {
    for (const p of packets) {
      const a = centerOf(p.from);
      const b = centerOf(p.to);
      const c = p.kind === "result" ? tk.ok : tk.accent;
      const e = ease(Math.min(1, p.t));
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = c;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = c;
      ctx.shadowColor = c;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(lerp(a.x, b.x, e), lerp(a.y, b.y, e), 3.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawConvo() {
    const c = convo;
    if (!c || c.arrived < 2) return;
    const a = centerOf(c.a);
    const b = centerOf(c.b);
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = tk.muted;
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  // The speaker's role icon leads the bubble, so it reads without color.
  function drawBubble() {
    const c = convo;
    if (!c || c.arrived < 2 || c.i < 0 || c.i >= c.lines.length) return;
    const [who, text] = c.lines[c.i];
    const speaker = byName.get(who);
    if (!speaker) return;
    const sp = speaker.m;
    const typing = c.age < TYPING_DOTS_S;
    ctx.save();
    ctx.font = `500 12px ${tk.sans}`;
    const tw = typing ? 26 : ctx.measureText(text).width;
    const w = tw + 38;
    const h = 28;
    const bx = clamp(sp.x - 10, 6, W - w - 6);
    const by = Math.max(6, sp.y - h - 10);
    ctx.globalAlpha = Math.min(1, c.age * 6);
    ctx.shadowColor = "rgba(0,0,0,.10)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
    rr(bx, by, w, h, 12);
    ctx.fillStyle = tk.surface;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = tk.line;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.save();
    ctx.translate(bx + 9, by + h / 2 - 6);
    ctx.scale(0.5, 0.5);
    ctx.strokeStyle = tk.accent;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const path of iconPaths.get(who) ?? []) ctx.stroke(path);
    ctx.restore();
    if (typing) {
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.3 + 0.7 * Math.max(0, Math.sin(time * 8 - i * 0.8));
        ctx.fillStyle = tk.muted;
        ctx.beginPath();
        ctx.arc(bx + 32 + i * 7, by + h / 2, 2.2, 0, TAU);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = tk.ink;
      ctx.textBaseline = "middle";
      ctx.fillText(text, bx + 28, by + h / 2 + 0.5);
    }
    ctx.restore();
  }

  function drawRipples() {
    for (const r of ripples) {
      const p = r.t / r.life;
      ctx.save();
      ctx.globalAlpha = (1 - p) * 0.8;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 4 + ease(p) * 22, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawAgent(a: Agent) {
    const t = a.task;
    const press =
      a.name === "Tester" && t && a.state === "act" && t.actT > 0.2 && t.actT < 0.4 ? 1 : 0;
    drawTrail(a);
    drawOrb(a, press);
    // While working, the frame tag already names the agent.
    const acting = a.state === "act" || a.state === "report";
    if (a.lead || !acting) drawNameTag(a, a.lead ? `Orchestrator · ${done} done` : a.name);
    if (a.chip) drawChip(a, a.chip);
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    // Lead halo, so the orchestrator reads as the hub.
    const hc = centerOf(lead);
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = tk.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(hc.x, hc.y, 24 + Math.sin(time * 2) * 2, 0, TAU);
    ctx.stroke();
    ctx.restore();

    workers.forEach(drawTaskMarks);
    workers.forEach(drawFrame);
    drawConvo();
    drawPackets();
    workers.forEach(drawRing);
    all.forEach(drawAgent);
    drawBubble();
    drawRipples();
  }

  // ---------- lifecycle ----------

  const onResize = () => {
    fit();
    for (const a of all) {
      a.m.x = clamp(a.m.x, 8, W - 8);
      a.m.y = clamp(a.m.y, 8, H - 8);
    }
    if (still) render();
  };
  window.addEventListener("resize", onResize);

  if (still) {
    for (let i = 0; i < 360; i++) step(1 / 30);
    render();
    return () => window.removeEventListener("resize", onResize);
  }

  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    // Clamped so a backgrounded tab (where rAF stops) resumes smoothly
    // instead of jumping the whole simulation forward.
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    render();
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    ctx.clearRect(0, 0, W, H);
  };
}
