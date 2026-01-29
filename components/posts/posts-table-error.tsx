import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface PostsTableErrorProps {
  error: Error | null;
  onRetry: () => void;
}

const PostsTableError = ({ error, onRetry }: PostsTableErrorProps) => (
  <div className="space-y-4">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading posts</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error?.message ?? "Failed to load posts. Please try again."}</span>
        <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  </div>
);

export { PostsTableError };
