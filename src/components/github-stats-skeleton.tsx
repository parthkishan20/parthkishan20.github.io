import { Card, CardContent } from "@/components/ui/card";

// Dimensions here must match GitHubStats' loaded state exactly (Card
// padding, icon size, value line-height, label size) so the live fetch
// resolving never shifts layout — that's the whole point of reserving
// the height instead of just showing a spinner.
export function GitHubStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="rounded-lg text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-2 h-8 w-8 animate-pulse rounded bg-muted" />
            <div className="mx-auto mb-1 h-9 w-16 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-4 w-24 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
