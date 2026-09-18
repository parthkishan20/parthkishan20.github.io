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
// `:focus-visible` gates the outline, so this draws nothing. `label`
// backs a visually-hidden heading so `aria-labelledby` always resolves
// to a real accessible name, whether or not the section's own content
// happens to render a heading with a matching id.
export function Section({ id, label, children }: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
      className="border-t border-border/60 py-[88px] first:border-t-0 md:py-32"
    >
      <h2 id={`${id}-heading`} className="sr-only">
        {label}
      </h2>
      {children}
    </section>
  );
}
