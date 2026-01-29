import { create } from "zustand";

export enum PlatformFilter {
  All = "all",
  Instagram = "instagram",
  TikTok = "tiktok",
}

export enum ChartViewType {
  Line = "line",
  Area = "area",
}

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

interface UIState {
  // Platform filter
  platformFilter: PlatformFilter;
  setPlatformFilter: (filter: PlatformFilter) => void;

  // Sorting
  sortColumn: string | null;
  sortDirection: SortDirection;
  setSorting: (column: string | null, direction: SortDirection) => void;

  // Modal
  selectedPostId: string | null;
  setSelectedPostId: (id: string | null) => void;

  // Chart
  chartViewType: ChartViewType;
  setChartViewType: (type: ChartViewType) => void;
}

export const useUIStore = create<UIState>(set => ({
  // Platform filter
  platformFilter: PlatformFilter.All,
  setPlatformFilter: filter => set({ platformFilter: filter }),

  // Sorting
  sortColumn: "posted_at",
  sortDirection: SortDirection.Desc,
  setSorting: (column, direction) => set({ sortColumn: column, sortDirection: direction }),

  // Modal
  selectedPostId: null,
  setSelectedPostId: id => set({ selectedPostId: id }),

  // Chart
  chartViewType: ChartViewType.Area,
  setChartViewType: type => set({ chartViewType: type }),
}));
