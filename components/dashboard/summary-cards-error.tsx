import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SummaryCardsErrorProps {
  error: Error | null;
  onRetry: () => void;
}

const SummaryCardsError = ({ error, onRetry }: SummaryCardsErrorProps) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <div className="col-span-full">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading analytics</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{error?.message ?? "Failed to load summary. Please try again."}</span>
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  </div>
);

export { SummaryCardsError };
