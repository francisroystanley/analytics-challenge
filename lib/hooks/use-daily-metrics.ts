import { useQuery } from "@tanstack/react-query";
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
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    if (response.status === 400) {
      const data = await response.json();
      throw new Error(data.error || "Invalid request");
    }

    throw new Error("Failed to fetch daily metrics");
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
