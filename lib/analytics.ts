import type { Post } from "@/lib/database.types";

export interface AnalyticsSummary {
  totalEngagement: number;
  averageEngagementRate: number | null;
  topPost: Post | null;
  trendPercentage: number | null;
  postCount: number;
}

const calculateSummary = (posts: Post[] = []): AnalyticsSummary => {
  if (!posts || posts.length === 0) {
    return {
      totalEngagement: 0,
      averageEngagementRate: null,
      topPost: null,
      trendPercentage: null,
      postCount: 0,
    };
  }

  // Calculate total engagement (likes + comments + shares)
  const totalEngagement = posts.reduce((sum, post) => {
    return sum + (post.likes ?? 0) + (post.comments ?? 0) + (post.shares ?? 0);
  }, 0);

  // Calculate average engagement rate
  const postsWithEngagementRate = posts.filter(p => p.engagement_rate !== null);
  const averageEngagementRate =
    postsWithEngagementRate.length > 0
      ? postsWithEngagementRate.reduce((sum, p) => sum + (p.engagement_rate ?? 0), 0) / postsWithEngagementRate.length
      : null;

  // Find top performing post (highest total engagement)
  const topPost = posts.reduce((top, post) => {
    const postEngagement = (post.likes ?? 0) + (post.comments ?? 0) + (post.shares ?? 0);
    const topEngagement = (top.likes ?? 0) + (top.comments ?? 0) + (top.shares ?? 0);

    return postEngagement > topEngagement ? post : top;
  }, posts[0]);

  // Calculate trend (last 7 days vs prior 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const recentPosts = posts.filter(p => new Date(p.posted_at) >= sevenDaysAgo);
  const priorPosts = posts.filter(
    p => new Date(p.posted_at) >= fourteenDaysAgo && new Date(p.posted_at) < sevenDaysAgo,
  );
  const recentEngagement = recentPosts.reduce(
    (sum, p) => sum + (p.likes ?? 0) + (p.comments ?? 0) + (p.shares ?? 0),
    0,
  );
  const priorEngagement = priorPosts.reduce((sum, p) => sum + (p.likes ?? 0) + (p.comments ?? 0) + (p.shares ?? 0), 0);
  let trendPercentage: number | null = null;

  if (priorEngagement > 0) {
    trendPercentage = ((recentEngagement - priorEngagement) / priorEngagement) * 100;
  } else if (recentEngagement > 0) {
    trendPercentage = 100;
  }

  return {
    totalEngagement,
    averageEngagementRate: averageEngagementRate ? Number(averageEngagementRate.toFixed(2)) : null,
    topPost,
    trendPercentage: trendPercentage ? Number(trendPercentage.toFixed(1)) : null,
    postCount: posts.length,
  };
};

const getDateRange = (days: number): { startDate: string; endDate: string } => {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return { startDate, endDate };
};

export { calculateSummary, getDateRange };
