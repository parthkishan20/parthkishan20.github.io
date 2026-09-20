import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  label: string;
  children: ReactNode;
}

// The one wrapper every top-level section uses (plan 3.2), so rhythm is
// defined exactly once instead of per page. The anchor offset moved to
// `html { scroll-padding-top }` in index.css — same "exactly once"
// intent, but one declaration for every anchor target on the page
// rather than a utility five elements had to remember to repeat.
//
// `tabIndex={-1}` makes the section a valid focus target so fragment
// navigation moves DOM focus into it. Without it Safari leaves focus on
// the nav link that was clicked, so the next Tab walks the rest of the
// nav instead of entering the content the reader just jumped to.
// `outline-none`, not left to `:focus-visible`: that heuristic was
// expected to suppress the ring here, but Chromium treats fragment-nav
// focus (a link click, or the browser landing on #about on load/
// refresh) as keyboard-equivalent, so it drew the full default outline
// around the entire section — a large, page-spanning black rectangle,
// not a subtle ring. tabIndex=-1 keeps this out of the normal Tab
// order (a sequential Tab press can never land here), so there's no
// keyboard user this outline would be helping; a screen reader still
// gets the section announced via aria-labelledby regardless of whether
// it's drawn. `label` backs a visually-hidden heading so
// aria-labelledby always resolves to a real accessible name, whether
// or not the section's own content happens to render a heading with a
// matching id.
export function Section({ id, label, children }: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
      className="border-t border-border/60 py-16 outline-none first:border-t-0 md:py-28"
    >
      <h2 id={`${id}-heading`} className="sr-only">
        {label}
      </h2>
      {children}
    </section>
  );
}
