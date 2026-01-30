import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_user_summary");

  if (error) {
    console.error("Error fetching summary:", error);

    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }

  return NextResponse.json(data);
}
