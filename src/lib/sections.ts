// Single source of truth for the seven nav entries (plan section 3).
// Shared by RailNav, MobileNav and the active-section observer so the
// three never drift out of sync with each other.

export interface SiteSection {
  id: string;
  label: string;
}

export const SECTIONS: SiteSection[] = [
  { id: "home", label: "Opening" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "background", label: "Background" },
  { id: "contact", label: "Contact" },
];

// Module-level constant: stable reference across renders so
// useActiveSection's effect does not re-run every render.
export const SECTION_IDS = SECTIONS.map((s) => s.id);
