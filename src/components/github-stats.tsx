import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, GitFork, Eye, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
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
        <span>GitHub stats unavailable — visit <a href="https://github.com/parthkishan20" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">github.com/parthkishan20</a></span>
      </div>
    );
  }

  const displayStats = [
    { label: "Public Repos", value: stats.repos, icon: GitFork },
    { label: "Total Stars", value: stats.stars, icon: Star },
    { label: "Followers", value: stats.followers, icon: Eye },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {displayStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardContent className="pt-6">
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-[#0077B5] to-[#00A0DC] bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
