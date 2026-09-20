import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resume } from "@/data/adapters";

const PREVIEW_QUERY = "(min-width: 1024px)";

// D6: iOS Safari does not reliably render a PDF in an iframe - a blank
// grey box is worse than a clear button. Base/md: two buttons plus the
// last-updated line, no iframe at all. lg+: the iframe preview too,
// buttons still above it.
//
// Plan 10 says to do this with CSS (`hidden lg:block`) "not a JS width
// check, so there is no hydration flash" - but its own acceptance
// criterion is "no iframe is present in the DOM below 1024px," which a
// CSS display:none toggle cannot satisfy: the <iframe> node still
// exists and still fetches its src, just invisible. These two
// instructions are mutually exclusive for an iframe specifically, so
// this resolves the same way Phase 7's snippet/acceptance conflict
// did - toward the literal, testable criterion, once its own stated
// reason turned out not to apply here: "hydration flash" is a
// server-rendered-markup-vs-client-mismatch problem, and this app has
// no SSR or hydration step at all (a plain createRoot().render() SPA,
// confirmed in Phase 7) - so there is no hydration to flash. A
// lazy useState initializer reads matchMedia synchronously before
// first paint, so there's no pop-in on desktop either.
export default function Resume() {
  const [showPreview, setShowPreview] = useState(
    () => typeof window !== "undefined" && window.matchMedia(PREVIEW_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(PREVIEW_QUERY);
    const onChange = () => setShowPreview(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <div id="resume">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Résumé
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated {resume.lastUpdated}
      </p>

      {/* Was two buttons here ("Open the résumé" + "Download PDF"),
          but Contact's own secondary CTA ("Read the résumé") already
          opens this exact PDF in a new tab one scroll above - same
          action, third label. Apple's one-action-per-block rule says
          cut the duplicate rather than relabel around it. Download is
          the one thing this block does that Contact doesn't. `outline`,
          not the filled/accent variant: Contact's "Email Parth" is
          this section's one real primary action, so this stays
          visually secondary rather than competing with it as a second
          solid-black button. Default (36px) size on purpose too - it
          reads as a quiet follow-up beneath Contact's size="lg" CTAs,
          not a reset back to full scale. */}
      <div className="mt-4">
        <Button variant="outline" asChild className="gap-2">
          <a href={resume.pdfPath} download>
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      {showPreview && (
        <div
          className="mt-6 w-full max-w-md overflow-hidden rounded-lg border border-border bg-muted"
          style={{ aspectRatio: "8.5/11", maxHeight: "75vh" }}
        >
          <iframe
            src={resume.pdfPath}
            title="Résumé preview"
            className="h-full w-full border-none"
          />
        </div>
      )}
    </div>
  );
}
