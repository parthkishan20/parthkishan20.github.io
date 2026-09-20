import { useEffect, useState } from "react";
import { CalendarDays, GitFork, Users, AlertCircle } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { GitHubStatsSkeleton } from "./github-stats-skeleton";

interface GitHubData {
  public_repos: number;
  followers: number;
  created_at: string;
}

export function GitHubStats() {
  const [stats, setStats] = useState({
    repos: 0,
    yearsOnGithub: 0,
    followers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { ref, revealed } = useReveal<HTMLDivElement>();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchGitHubData = async () => {
      try {
        const userResponse = await fetch("https://api.github.com/users/parthkishan20", { signal });
        if (!userResponse.ok) throw new Error(`User API error: ${userResponse.status}`);
        const userData: GitHubData = await userResponse.json();

        // Total stars used to live here, summed across every repo from
        // a second fetch — dropped along with that fetch: most of
        // these repos are internship/coursework work, not open-source
        // projects built to attract stars, so the number sat at 0 and
        // read as a null result instead of a proof point. Years on
        // GitHub comes straight off this same response's `created_at`,
        // no second request needed — real, always positive, and it
        // only grows. `Math.max(1, …)` so an account created earlier
        // this same calendar year still reads "1", not "0".
        const yearsOnGithub = Math.max(
          1,
          new Date().getFullYear() - new Date(userData.created_at).getFullYear()
        );

        setStats({
          repos: userData.public_repos,
          yearsOnGithub,
          followers: userData.followers,
        });
        setLoading(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Error fetching GitHub data:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchGitHubData();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <GitHubStatsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>
          GitHub stats unavailable — visit{" "}
          <a
            href="https://github.com/parthkishan20"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            github.com/parthkishan20
          </a>
        </span>
      </div>
    );
  }

  const displayStats = [
    { label: "Public repos", value: stats.repos, icon: GitFork },
    { label: "Years on GitHub", value: stats.yearsOnGithub, icon: CalendarDays },
    { label: "Followers", value: stats.followers, icon: Users },
  ];

  // Same bounded chip-grid pattern figure-strip.tsx uses on Home —
  // this widget had the identical mobile problem (icon/number/label
  // stacked with a big gap, three times, no boundary tying them
  // together as one set). Mobile: 2-up `bg-muted` chips, last one
  // spans the full row since the count is odd. `sm` and up keeps the
  // original centered 3-column layout.
  //
  // Icon placement picked from a live A/B/C comparison: it no longer
  // floats large above the number (that made it compete with the
  // number for attention). It sits small, inline, right next to its
  // own label instead — a clarifying glyph next to the caption it
  // belongs to, not a second hero element per stat.
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex flex-col gap-1.5 rounded-xl bg-muted p-4 ${
                index === displayStats.length - 1 &&
                displayStats.length % 2 !== 0
                  ? "col-span-2"
                  : ""
              }`}
            >
              <div className="font-display text-2xl font-semibold tabular-nums tracking-[-0.03em] text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col items-start gap-1.5">
              <div className="font-display text-[clamp(28px,4vw,44px)] font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 text-[15px] text-muted-foreground">
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
