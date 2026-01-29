import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EngagementChartSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-5 w-40" />
      <div className="flex gap-1">
        <Skeleton className="h-8 w-14" />
        <Skeleton className="h-8 w-14" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-75 w-full">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

export { EngagementChartSkeleton };
