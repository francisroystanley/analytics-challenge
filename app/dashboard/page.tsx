import { redirect } from "next/navigation";
import { EngagementChart } from "@/components/charts/engagement-chart";
import { SummaryCards } from "@/components/dashboard/summary-cards";
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
        <SummaryCards />

        {/* Engagement Chart */}
        <EngagementChart />

        {/* Posts Table and Modal */}
        <DashboardContent />
      </main>
    </div>
  );
};

export default DashboardPage;
