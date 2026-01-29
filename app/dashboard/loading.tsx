import { EngagementChartSkeleton } from "@/components/charts/engagement-chart-skeleton";
import { SummaryCardsSkeleton } from "@/components/dashboard/summary-cards-skeleton";
import { PostsTableSkeleton } from "@/components/posts/posts-table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardLoading = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
      </div>
    </header>
    <main className="container mx-auto px-4 py-6 space-y-6">
      <SummaryCardsSkeleton />
      <EngagementChartSkeleton />
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <PostsTableSkeleton />
        </CardContent>
      </Card>
    </main>
  </div>
);

export default DashboardLoading;
