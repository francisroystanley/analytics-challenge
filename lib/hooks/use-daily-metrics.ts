import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-error";
import type { DailyMetric } from "@/lib/database.types";
import { queryKeys } from "@/lib/queries/keys";

interface DailyMetricsResponse {
  metrics: DailyMetric[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface UseDailyMetricsOptions {
  days?: number;
}

const fetchDailyMetrics = async (days: number): Promise<DailyMetricsResponse> => {
  const response = await fetch(`/api/metrics/daily?days=${days}`);

  if (!response.ok) {
    throw await ApiError.fromResponse(response, "Failed to fetch daily metrics");
  }

  return response.json();
};

const useDailyMetrics = (options: UseDailyMetricsOptions = {}) => {
  const { days = 30 } = options;

  return useQuery({
    queryKey: queryKeys.metrics.daily(days),
    queryFn: () => fetchDailyMetrics(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export { useDailyMetrics };
export type { DailyMetricsResponse };
