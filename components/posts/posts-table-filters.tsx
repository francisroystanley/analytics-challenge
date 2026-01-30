"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardParams } from "@/lib/hooks/use-dashboard-params";
import { PlatformFilter } from "@/lib/stores/ui-store";

interface PostsTableFiltersProps {
  // Only server-derived data as props
  startItem: number;
  endItem: number;
  total: number;
  isFetching: boolean;
}

const PostsTableFilters = ({ startItem, endItem, total, isFetching }: PostsTableFiltersProps) => {
  // UI state from Zustand
  const { platformFilter, setPlatformFilter } = useDashboardParams();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select value={platformFilter} onValueChange={value => setPlatformFilter(value as PlatformFilter)} disabled={isFetching}>
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
    </div>
  );
};

export { PostsTableFilters };
