"use client";

import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformFilter, usePostsTableState } from "@/lib/stores/ui-store";

interface PostsTableFiltersProps {
  // Only server-derived data as props
  startItem: number;
  endItem: number;
  total: number;
  isFetching: boolean;
}

const PostsTableFilters = ({ startItem, endItem, total, isFetching }: PostsTableFiltersProps) => {
  // UI state from Zustand
  const { platformFilter, setPlatformFilter } = usePostsTableState();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select value={platformFilter} onValueChange={value => setPlatformFilter(value as PlatformFilter)}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PlatformFilter.All}>All Platforms</SelectItem>
            <SelectItem value={PlatformFilter.Instagram}>Instagram</SelectItem>
            <SelectItem value={PlatformFilter.TikTok}>TikTok</SelectItem>
          </SelectContent>
        </Select>
        {total > 0 && (
          <span className="text-sm text-muted-foreground">
            Showing {startItem}-{endItem} of {total} posts
          </span>
        )}
      </div>
      {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
};

export { PostsTableFilters };
