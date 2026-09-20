// Dimensions here must match GitHubStats' loaded state exactly (chip
// padding, value line-height, icon size, label size) so the live fetch
// resolving never shifts layout - that's the whole point of reserving
// the shape instead of just showing a spinner. Mirrors GitHubStats'
// own two-layout split (bounded chip grid on mobile, left-aligned
// 3-column stack from `sm` up) and its number-first, icon-inline-
// with-label order.
export function GitHubStatsSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex flex-col gap-1.5 rounded-xl bg-muted p-4 ${
              i === 3 ? "col-span-2" : ""
            }`}
          >
            <div className="h-7 w-12 animate-pulse rounded bg-background" />
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-background" />
              <div className="h-3 w-20 animate-pulse rounded bg-background" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-start gap-1.5">
            <div className="h-9 w-16 animate-pulse rounded bg-muted" />
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
