export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    list: (filters: { platform?: string }) =>
      [...queryKeys.posts.all, "list", filters] as const,
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
