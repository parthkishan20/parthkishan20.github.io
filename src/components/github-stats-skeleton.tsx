import { Card, CardContent } from "@/components/ui/card";

export function GitHubStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="text-center">
          <CardContent className="pt-6">
            <div className="h-8 w-8 mx-auto mb-2 bg-muted rounded animate-pulse" />
            <div className="h-9 w-16 mx-auto mb-1 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 mx-auto bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
