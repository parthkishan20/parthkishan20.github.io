import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, GitFork, Eye, AlertCircle } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { GitHubStatsSkeleton } from "./github-stats-skeleton";

interface GitHubData {
  public_repos: number;
  followers: number;
  public_gists: number;
}

interface RepoData {
  stargazers_count: number;
}

export function GitHubStats() {
  const [stats, setStats] = useState({
    repos: 0,
    stars: 0,
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

        const reposResponse = await fetch("https://api.github.com/users/parthkishan20/repos?per_page=100", { signal });
        if (!reposResponse.ok) throw new Error(`Repos API error: ${reposResponse.status}`);
        const reposData: RepoData[] = await reposResponse.json();

        if (!Array.isArray(reposData)) throw new Error("Repos response is not an array");

        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        setStats({
          repos: userData.public_repos,
          stars: totalStars,
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
    { label: "Public Repos", value: stats.repos, icon: GitFork },
    { label: "Total Stars", value: stats.stars, icon: Star },
    { label: "Followers", value: stats.followers, icon: Eye },
  ];

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 gap-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:grid-cols-3 ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {displayStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="rounded-lg text-center transition-[border-color,transform] duration-[220ms] hover:-translate-y-[3px] hover:border-muted-foreground-2"
          >
            <CardContent className="pt-6">
              <Icon className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="mb-1 font-display text-3xl font-bold tabular-nums tracking-[-0.03em] text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
