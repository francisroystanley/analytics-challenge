"use client";

import { useMemo } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import { bisector } from "d3-array";
import { formatDate, formatNumber } from "@/lib/format";
import { useDashboardParams } from "@/lib/hooks/use-dashboard-params";
import { ChartViewType } from "@/lib/stores/ui-store";
import { EngagementChartTooltip } from "./engagement-chart-tooltip";

export interface ChartData {
  date: Date;
  engagement: number;
  reach: number;
}

interface EngagementChartInnerProps {
  data: ChartData[];
  width: number;
  height: number;
}

const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const bisectDate = bisector<ChartData, Date>(d => d.date).left;

const EngagementChartInner = ({ data, width, height }: EngagementChartInnerProps) => {
  // UI state from Zustand
  const { chartViewType } = useDashboardParams();

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<ChartData>();
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const tickInterval = useMemo(() => {
    if (width < 400) return 7;

    if (width < 600) return 5;

    if (width < 800) return 4;

    return 3;
  }, [width]);

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
          {chartViewType === ChartViewType.Area ? (
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
            tickValues={data.filter((_, i) => i % tickInterval === 0).map(d => d.date)}
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
      {tooltipOpen && tooltipData && <EngagementChartTooltip data={tooltipData} left={tooltipLeft} top={tooltipTop} />}
    </div>
  );
};

export { EngagementChartInner };
