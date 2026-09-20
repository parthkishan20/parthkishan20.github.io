import type { SVGProps } from "react";

// Vector marks from Simple Icons (simpleicons.org), CC0 - built
// specifically for identifying a real brand/service, not decorative
// reuse. Rendered with `fill="currentColor"` so they inherit the
// site's ink color instead of each brand's own hex, matching the
// monochrome-plus-one-accent palette this whole site already commits
// to (see index.css's 13-token comment). Bloomberg has no such source
// and stays on the letter-monogram fallback in certifications.tsx.
export function AnthropicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <title>Anthropic</title>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

export function UdemyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <title>Udemy</title>
      <path d="M12 0L5.81 3.573v3.574l6.189-3.574 6.191 3.574V3.573zM5.81 10.148v8.144c0 1.85.589 3.243 1.741 4.234S10.177 24 11.973 24s3.269-.482 4.448-1.474c1.179-.991 1.768-2.439 1.768-4.314v-8.064h-3.242v7.85c0 2.036-1.509 3.055-2.948 3.055-1.428 0-2.947-.991-2.947-3.027v-7.878z" />
    </svg>
  );
}

// Traced (via potrace, a bitmap-to-vector tracer) from a monochrome
// rendering of the standard LinkedIn "in" mark, rather than
// redistributing any single provider's icon file - used here purely
// to identify LinkedIn Learning as the real, verifiable issuer of a
// real credential (the same nominative use every certificate/resume
// site makes of an issuer's mark), not as decoration or an implied
// partnership.
export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <title>LinkedIn</title>
      <path d="M13.1 9.4c-4.9 2.7-5 3.7-5.1 40.4 0 37.2.2 38.6 5.5 41 4.1 1.9 69.7 1.7 73.4-.2C91.8 88 92 86.5 92 50s-.2-38-5.1-40.6c-3.9-2-70.2-2-73.8 0M86 14c1.9 1.9 2 3.3 2 36s-.1 34.1-2 36-3.3 2-36 2-34.1-.1-36-2-2-3.3-2-36 .1-34.1 2-36 3.3-2 36-2 34.1.1 36 2M22.5 24.5C21.1 25.8 20 27.8 20 29c0 3.2 4.4 7 8 7s8-3.8 8-7-4.4-7-8-7c-1.9 0-4 .9-5.5 2.5m8.9 3.8c1.3 2.1-.7 3.9-3.8 3.5-2.8-.4-4.5-3.6-2.6-4.8 2.1-1.4 5.1-.8 6.4 1.3M20.5 39.2c-.3.8-.4 10.1-.3 20.8l.3 19.5h15v-41l-7.3-.3c-5.3-.2-7.4.1-7.7 1M32 59v17h-8V42h8zm6.4-19.7c-.2.7-.3 10-.2 20.7l.3 19.5h15L54 67c.3-6.9.9-13.1 1.3-13.8.5-.6 1.8-1.2 3-1.2 4.7 0 5.2 1.2 5.7 14.7l.5 12.8h15l.3-14c.2-12.9.1-14.4-2-18.4-1.3-2.5-3.5-5.3-4.9-6.4-3.7-2.6-10.6-3.3-15.1-1.4-3.1 1.3-3.7 1.3-4.2.1-.7-1.9-14.4-2-15.2-.1M50 43.9c0 3.1 1.8 3.4 5.3.9 4.3-3.1 12.5-3.2 15.7-.3 4 3.5 5 7.6 5 20V76h-8V64.9c0-10.9 0-11.1-2.9-14-2-2-3.9-2.9-6.1-2.9s-4.1.9-6.1 2.9C50 53.8 50 54 50 64.9V76h-8V42h4c3.3 0 4 .3 4 1.9" />
    </svg>
  );
}
