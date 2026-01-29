import { PlatformFilter, SortDirection } from "@/lib/stores/ui-store";

export interface PostsListParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortDirection;
  platform: PlatformFilter;
}

export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    list: (params: PostsListParams) =>
      [...queryKeys.posts.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.posts.all, "detail", id] as const,
  },
  metrics: {
    all: ["metrics"] as const,
    daily: (days: number = 30) => [...queryKeys.metrics.all, "daily", days] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    summary: () => [...queryKeys.analytics.all, "summary"] as const,
  },
};
