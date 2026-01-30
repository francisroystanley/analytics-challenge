import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { Post } from "../database.types";

interface AnalyticsSummary {
  totalEngagement: number;
  averageEngagementRate: number | null;
  topPost: Post | null;
  trendPercentage: number | null;
  postCount: number;
}

const fetchAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const response = await fetch("/api/analytics/summary");

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    throw new Error("Failed to fetch analytics summary");
  }

  return response.json();
};

const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: fetchAnalyticsSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export { useAnalyticsSummary };
