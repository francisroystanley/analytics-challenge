"use client";

import { useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyMetrics } from "@/lib/hooks/use-daily-metrics";
import { useDashboardParams } from "@/lib/hooks/use-dashboard-params";
import { ChartViewType } from "@/lib/stores/ui-store";
import { EngagementChartError } from "./engagement-chart-error";
import { EngagementChartInner, type ChartData } from "./engagement-chart-inner";
import { EngagementChartSkeleton } from "./engagement-chart-skeleton";

const EngagementChart = () => {
  const { chartViewType, setChartViewType } = useDashboardParams();
  const { data, isLoading, isError, error, refetch } = useDailyMetrics({ days: 30 });

  const metrics = useMemo(() => data?.metrics ?? [], [data?.metrics]);

  const chartData: ChartData[] = useMemo(
    () =>
      metrics
        .map(m => ({
          date: new Date(m.date),
          engagement: m.engagement ?? 0,
          reach: m.reach ?? 0,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [metrics],
  );

  if (isLoading) {
    return <EngagementChartSkeleton />;
  }

  if (isError) {
    return <EngagementChartError error={error instanceof Error ? error : null} onRetry={refetch} />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Engagement Over Time</CardTitle>
        {chartData.length > 0 && (
          <div className="flex gap-1">
            <Button
              variant={chartViewType === ChartViewType.Area ? "default" : "outline"}
              size="sm"
              onClick={() => setChartViewType(ChartViewType.Area)}
            >
              Area
            </Button>
            <Button
              variant={chartViewType === ChartViewType.Line ? "default" : "outline"}
              size="sm"
              onClick={() => setChartViewType(ChartViewType.Line)}
            >
              Line
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No metrics data available
            </div>
          ) : (
            <ParentSize>
              {({ width, height }) =>
                width > 0 && height > 0 ? (
                  <EngagementChartInner data={chartData} width={width} height={height} />
                ) : (
                  <Skeleton className="h-full w-full rounded-lg" />
                )
              }
            </ParentSize>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { EngagementChart };
