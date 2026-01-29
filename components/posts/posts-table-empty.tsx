"use client";

import { PlatformFilter, usePostsTableState } from "@/lib/stores/ui-store";
import { PostsTableFilters } from "./posts-table-filters";

const PostsTableEmpty = () => {
  const { platformFilter } = usePostsTableState();

  return (
    <div className="space-y-4">
      <PostsTableFilters startItem={0} endItem={0} total={0} isFetching={false} />
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          {platformFilter === PlatformFilter.All
            ? "No posts found. Start creating content to see your analytics!"
            : "No posts match the current filter."}
        </p>
      </div>
    </div>
  );
};

export { PostsTableEmpty };
