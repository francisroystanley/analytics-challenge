import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@/lib/database.types";
import { PlatformFilter, SortDirection } from "@/lib/stores/ui-store";
import { createClient } from "@/lib/supabase/server";

export interface PostsQueryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortDirection;
  platform: PlatformFilter;
}

export interface PostsPaginatedResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  params: {
    sortBy: string;
    sortOrder: SortDirection;
    platform: PlatformFilter;
  };
}

const VALID_SORT_COLUMNS = [
  "posted_at",
  "likes",
  "comments",
  "shares",
  "engagement_rate",
  "platform",
];

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Validate auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
  );
  const sortBy = searchParams.get("sortBy") ?? "posted_at";
  const sortOrderParam = searchParams.get("sortOrder");
  const sortOrder = sortOrderParam === SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc;
  const platformParam = searchParams.get("platform") ?? PlatformFilter.All;
  const platform = Object.values(PlatformFilter).includes(platformParam as PlatformFilter)
    ? (platformParam as PlatformFilter)
    : PlatformFilter.All;

  // Validate sortBy column
  if (!VALID_SORT_COLUMNS.includes(sortBy)) {
    return NextResponse.json(
      { error: `Invalid sort column: ${sortBy}` },
      { status: 400 }
    );
  }

  // Build base query for counting
  let countQuery = supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (platform !== PlatformFilter.All) {
    countQuery = countQuery.eq("platform", platform);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json(
      { error: "Failed to count posts" },
      { status: 500 }
    );
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Build data query
  let dataQuery = supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order(sortBy, { ascending: sortOrder === SortDirection.Asc })
    .range(offset, offset + limit - 1);

  if (platform !== PlatformFilter.All) {
    dataQuery = dataQuery.eq("platform", platform);
  }

  const { data: posts, error: dataError } = await dataQuery;

  if (dataError) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }

  const response: PostsPaginatedResponse = {
    posts: (posts as Post[]) ?? [],
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    params: {
      sortBy,
      sortOrder,
      platform,
    },
  };

  return NextResponse.json(response);
}
