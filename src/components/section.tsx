import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  label: string;
  children: ReactNode;
}

// The one wrapper every top-level section uses (plan 3.2), so rhythm and
// anchor offsets are defined exactly once instead of per page. `label`
// backs a visually-hidden heading so `aria-labelledby` always resolves
// to a real accessible name, whether or not the section's own content
// happens to render a heading with a matching id.
export function Section({ id, label, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-[72px] border-t border-border/60 py-[88px] first:border-t-0 md:py-32 rail:scroll-mt-6"
    >
      <h2 id={`${id}-heading`} className="sr-only">
        {label}
      </h2>
      {children}
    </section>
  );
}
