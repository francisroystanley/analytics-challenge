import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PostsPaginatedResponse } from "@/app/api/posts/route";
import { queryKeys, type PostsListParams } from "@/lib/queries/keys";
import { PlatformFilter, SortDirection } from "@/lib/stores/ui-store";

interface UsePostsOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortDirection;
  platform: PlatformFilter;
}

const fetchPosts = async (params: PostsListParams): Promise<PostsPaginatedResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    platform: params.platform,
  });

  const response = await fetch(`/api/posts?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Failed to fetch posts");
  }

  return response.json();
};

const usePosts = ({ page, limit, sortBy, sortOrder, platform }: UsePostsOptions) => {
  const params: PostsListParams = { page, limit, sortBy, sortOrder, platform };

  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => fetchPosts(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export { usePosts };
