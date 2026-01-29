import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface TrendIndicatorProps {
  value: number | null;
}

const TrendIndicator = ({ value }: TrendIndicatorProps) => {
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

export { TrendIndicator };
