import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Edge runtime for low latency
export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") ?? "30", 10);

  // Validate days parameter
  if (isNaN(days) || days < 1 || days > 90) {
    return NextResponse.json({ error: "Invalid days parameter. Must be between 1 and 90." }, { status: 400 });
  }

  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch daily metrics via Postgres function
  const { data, error: metricsError } = await supabase.rpc("get_daily_metrics", {
    days_count: days,
  });

  if (metricsError) {
    console.error("Error fetching metrics:", metricsError);

    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }

  return NextResponse.json(data);
}
