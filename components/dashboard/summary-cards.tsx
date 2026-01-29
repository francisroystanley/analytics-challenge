import { BarChart3, Heart, Minus, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/database.types";
import { formatNumber } from "@/lib/format";

interface SummaryCardsProps {
  totalEngagement: number;
  averageEngagementRate: number | null;
  topPost: Post | null;
  trendPercentage: number | null;
  postCount: number;
}

const TrendIndicator = ({ value }: { value: number | null }) => {
  if (value === null) {
    return (
      <div className="flex items-center text-muted-foreground">
        <Minus className="h-4 w-4 mr-1" />
        <span className="text-sm">No prior data</span>
      </div>
    );
  }

  if (value > 0) {
    return (
      <div className="flex items-center text-green-600">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span className="text-sm">+{value.toFixed(1)}%</span>
      </div>
    );
  }

  if (value < 0) {
    return (
      <div className="flex items-center text-red-600">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span className="text-sm">{value.toFixed(1)}%</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-muted-foreground">
      <Minus className="h-4 w-4 mr-1" />
      <span className="text-sm">0%</span>
    </div>
  );
};

const SummaryCards = ({
  totalEngagement,
  averageEngagementRate,
  topPost,
  trendPercentage,
  postCount,
}: SummaryCardsProps) => {
  // Handle empty state
  if (postCount === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No posts yet. Start creating content to see your analytics!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Engagement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageEngagementRate !== null ? `${averageEngagementRate.toFixed(2)}%` : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">across {postCount} posts</p>
        </CardContent>
      </Card>

      {/* Top Performing Post */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performing Post</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {topPost ? (
            <div className="flex items-start gap-3">
              {topPost.thumbnail_url && (
                <Image src={topPost.thumbnail_url} alt="Post thumbnail" width={48} height={48} className="w-12 h-12 rounded object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {topPost.caption?.slice(0, 60) ?? "No caption"}
                  {(topPost.caption?.length ?? 0) > 60 ? "..." : ""}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
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
