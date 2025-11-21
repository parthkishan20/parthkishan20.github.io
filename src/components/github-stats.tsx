import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, GitFork, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { GitHubStatsSkeleton } from "./github-stats-skeleton";

interface GitHubData {
  public_repos: number;
  followers: number;
  public_gists: number;
}

export function GitHubStats() {
  const [stats, setStats] = useState({
    repos: 0,
    stars: 0,
    followers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("https://api.github.com/users/parthkishan20");
        const userData: GitHubData = await userResponse.json();

        // Fetch repositories to calculate total stars
        const reposResponse = await fetch("https://api.github.com/users/parthkishan20/repos?per_page=100");
        const reposData = await reposResponse.json();
        
        const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

        setStats({
          repos: userData.public_repos,
          stars: totalStars,
          followers: userData.followers,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return <GitHubStatsSkeleton />;
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
                <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
