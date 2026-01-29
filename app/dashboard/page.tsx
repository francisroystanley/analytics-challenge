import { redirect } from "next/navigation";
import { EngagementChart } from "@/components/charts/engagement-chart";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { calculateSummary, getDateRange } from "@/lib/analytics";
import type { DailyMetric, Post } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "./dashboard-content";
import { DashboardHeader } from "./dashboard-header";

const DashboardPage = async () => {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch posts directly from Supabase
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("posted_at", { ascending: false });

  // Calculate summary using shared utility
  const summary = calculateSummary(posts as Post[]);

  // Fetch daily metrics directly from Supabase
  const { startDate, endDate } = getDateRange(30);

  const { data: metrics } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
          <DashboardHeader userEmail={user.email ?? ""} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <SummaryCards
          totalEngagement={summary.totalEngagement}
          averageEngagementRate={summary.averageEngagementRate}
          topPost={summary.topPost}
          trendPercentage={summary.trendPercentage}
          postCount={summary.postCount}
        />

        {/* Engagement Chart */}
        <EngagementChart metrics={metrics as DailyMetric[]} />

        {/* Posts Table and Modal */}
        <DashboardContent posts={posts as Post[]} />
      </main>
    </div>
  );
};

export default DashboardPage;
