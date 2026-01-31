import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-error";
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
    throw await ApiError.fromResponse(response, "Failed to fetch analytics summary");
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
