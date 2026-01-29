"use client";

import { useMemo, useState } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { TooltipWithBounds, defaultStyles, useTooltip } from "@visx/tooltip";
import { bisector } from "d3-array";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyMetric } from "@/lib/database.types";
import { formatDate, formatNumber } from "@/lib/format";
import { ChartViewType } from "@/lib/stores/ui-store";

interface EngagementChartProps {
  metrics: DailyMetric[];
}

interface ChartData {
  date: Date;
  engagement: number;
  reach: number;
}

const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const tooltipStyles = {
  ...defaultStyles,
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--popover-foreground))",
  borderRadius: "6px",
  lineHeight: 1.5,
  padding: "8px 12px",
  fontSize: "12px",
};
const bisectDate = bisector<ChartData, Date>(d => d.date).left;

const Chart = ({
  data,
  width,
  height,
  viewType,
}: {
  data: ChartData[];
  width: number;
  height: number;
  viewType: ChartViewType;
}) => {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<ChartData>();
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [Math.min(...data.map(d => d.date.getTime())), Math.max(...data.map(d => d.date.getTime()))],
        range: [0, innerWidth],
      }),
    [data, innerWidth],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map(d => d.engagement)) * 1.1],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data, innerHeight],
  );

  const handleTooltip = (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
    const point = localPoint(event);

    if (!point) return;

    const x0 = xScale.invert(point.x - margin.left);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;

    if (d1 && d1.date) {
      d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
    }

    showTooltip({
      tooltipData: d,
      tooltipLeft: xScale(d.date) + margin.left,
      tooltipTop: yScale(d.engagement) + margin.top,
    });
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="engagement-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            strokeDasharray="3,3"
            stroke="hsl(var(--border))"
            strokeOpacity={0.5}
          />
          {viewType === ChartViewType.Area ? (
            <AreaClosed
              data={data}
              x={d => xScale(d.date)}
              y={d => yScale(d.engagement)}
              yScale={yScale}
              curve={curveMonotoneX}
              fill="url(#engagement-gradient)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          ) : (
            <LinePath
              data={data}
              x={d => xScale(d.date)}
              y={d => yScale(d.engagement)}
              curve={curveMonotoneX}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          )}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickFormat={d => formatDate(d as Date, "chart")}
            tickValues={data.filter((_, i) => i % 3 === 0).map(d => d.date)}
            stroke="hsl(var(--border))"
            tickStroke="hsl(var(--border))"
            tickLabelProps={() => ({
              fill: "hsl(var(--muted-foreground))",
              fontSize: 11,
              textAnchor: "middle",
            })}
          />
          <AxisLeft
            scale={yScale}
            tickFormat={d => formatNumber(d as number)}
            numTicks={5}
            stroke="hsl(var(--border))"
            tickStroke="hsl(var(--border))"
            tickLabelProps={() => ({
              fill: "hsl(var(--muted-foreground))",
              fontSize: 11,
              textAnchor: "end",
              dx: -4,
              dy: 4,
            })}
          />
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleTooltip}
            onMouseLeave={hideTooltip}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
          />
          {tooltipData && (
            <circle
              cx={xScale(tooltipData.date)}
              cy={yScale(tooltipData.engagement)}
              r={5}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth={2}
              pointerEvents="none"
            />
          )}
        </g>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds left={tooltipLeft} top={tooltipTop} style={tooltipStyles}>
          <div className="font-medium">{formatDate(tooltipData.date, "chart")}</div>
          <div className="text-muted-foreground">
            Engagement: <span className="text-foreground font-medium">{formatNumber(tooltipData.engagement)}</span>
          </div>
          <div className="text-muted-foreground">
            Reach: <span className="text-foreground font-medium">{formatNumber(tooltipData.reach)}</span>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

const EngagementChart = ({ metrics = [] }: EngagementChartProps) => {
  const [viewType, setViewType] = useState<ChartViewType>(ChartViewType.Area);
  const chartData: ChartData[] = useMemo(() => {
    return metrics
      .map(m => ({
        date: new Date(m.date),
        engagement: m.engagement ?? 0,
        reach: m.reach ?? 0,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [metrics]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Engagement Over Time</CardTitle>
        <div className="flex gap-1">
          <Button
            variant={viewType === ChartViewType.Area ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType(ChartViewType.Area)}
          >
            Area
          </Button>
          <Button
            variant={viewType === ChartViewType.Line ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType(ChartViewType.Line)}
          >
            Line
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No metrics data available
            </div>
          ) : (
            <ParentSize>
              {({ width, height }) => <Chart data={chartData} width={width} height={height} viewType={viewType} />}
            </ParentSize>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { EngagementChart };
