import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDateRange } from "@/lib/analytics";
import type { Database } from "@/lib/database.types";

// Edge runtime for low latency
export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") ?? "30", 10);

  // Validate days parameter
  if (isNaN(days) || days < 1 || days > 90) {
    return NextResponse.json({ error: "Invalid days parameter. Must be between 1 and 90." }, { status: 400 });
  }

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Ignore in Edge runtime
          }
        },
      },
    },
  );

  // Validate authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Calculate date range
  const { startDate, endDate } = getDateRange(days);

  // Fetch daily metrics
  const { data: metrics, error: metricsError } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (metricsError) {
    console.error("Error fetching metrics:", metricsError);

    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }

  return NextResponse.json({
    metrics: metrics ?? [],
    dateRange: {
      start: startDate,
      end: endDate,
    },
  });
}
