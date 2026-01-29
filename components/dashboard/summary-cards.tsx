"use client";

import { BarChart3, Heart, Trophy } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { useAnalyticsSummary } from "@/lib/hooks/use-analytics-summary";
import { SummaryCardsSkeleton } from "./summary-cards-skeleton";
import { TrendIndicator } from "./trend-indicator";

const SummaryCards = () => {
  const { data, isLoading } = useAnalyticsSummary();

  if (isLoading) {
    return <SummaryCardsSkeleton />;
  }

  const {
    totalEngagement = 0,
    averageEngagementRate = null,
    topPost = null,
    trendPercentage = null,
    postCount = 0,
  } = data ?? {};

  // Handle empty state
  if (postCount === 0) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              No posts yet. Start creating content to see your analytics!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Engagement */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium truncate">Total Engagement</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalEngagement)}</div>
          <div className="mt-1">
            <TrendIndicator value={trendPercentage} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">vs. previous 7 days</p>
        </CardContent>
      </Card>

      {/* Average Engagement Rate */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium truncate">Avg. Engagement Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageEngagementRate !== null ? `${averageEngagementRate.toFixed(2)}%` : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">across {postCount} posts</p>
        </CardContent>
      </Card>

      {/* Top Performing Post */}
      <Card className="sm:col-span-2 min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium truncate">Top Performing Post</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
        </CardHeader>
        <CardContent>
          {topPost ? (
            <div className="flex items-start gap-3">
              {topPost.thumbnail_url && (
                <Image
                  src={topPost.thumbnail_url}
                  alt="Post thumbnail"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {topPost.caption?.slice(0, 60) ?? "No caption"}
                  {(topPost.caption?.length ?? 0) > 60 ? "..." : ""}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                  <span>
                    {formatNumber((topPost.likes ?? 0) + (topPost.comments ?? 0) + (topPost.shares ?? 0))} engagements
                  </span>
                  <span className="capitalize">{topPost.platform}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No posts available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { SummaryCards };
