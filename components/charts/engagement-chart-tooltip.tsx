import { TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { formatDate, formatNumber } from "@/lib/format";
import type { ChartData } from "./engagement-chart-inner";

interface EngagementChartTooltipProps {
  data: ChartData;
  left?: number;
  top?: number;
}

const tooltipStyles = {
  ...defaultStyles,
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--popover-foreground))",
  borderRadius: "6px",
  lineHeight: 1.5,
  padding: "8px 12px",
  fontSize: "12px",
};

const EngagementChartTooltip = ({ data, left, top }: EngagementChartTooltipProps) => (
  <TooltipWithBounds left={left} top={top} style={tooltipStyles}>
    <div className="font-medium">{formatDate(data.date, "chart")}</div>
    <div className="text-muted-foreground">
      Engagement: <span className="text-foreground font-medium">{formatNumber(data.engagement)}</span>
    </div>
    <div className="text-muted-foreground">
      Reach: <span className="text-foreground font-medium">{formatNumber(data.reach)}</span>
    </div>
  </TooltipWithBounds>
);

export { EngagementChartTooltip };
