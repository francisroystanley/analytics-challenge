import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EngagementChartErrorProps {
  error: Error | null;
  onRetry: () => void;
}

const EngagementChartError = ({ error, onRetry }: EngagementChartErrorProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base font-medium">Engagement Over Time</CardTitle>
    </CardHeader>
    <CardContent>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading chart data</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{error?.message ?? "Failed to load metrics. Please try again."}</span>
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

export { EngagementChartError };
