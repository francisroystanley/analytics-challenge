import { NextResponse } from "next/server";
import { calculateSummary } from "@/lib/analytics";
import type { Post } from "@/lib/database.types";
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

  // Fetch all posts for the user
  const { data: posts, error: postsError } = await supabase.from("posts").select("*").eq("user_id", user.id);

  if (postsError) {
    console.error("Error fetching posts:", postsError);

    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  const summary = calculateSummary(posts as Post[]);

  return NextResponse.json(summary);
}
