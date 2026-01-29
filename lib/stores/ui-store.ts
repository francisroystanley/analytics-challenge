import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { Post } from "@/lib/database.types";

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

interface PostsTableState {
  // Pagination
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPage: () => void;

  // Platform filter
  platformFilter: PlatformFilter;
  setPlatformFilter: (filter: PlatformFilter) => void;

  // Sorting
  sortColumn: string;
  sortDirection: SortDirection;
  setSorting: (column: string, direction: SortDirection) => void;
}

interface ModalState {
  // Modal
  selectedPost: Post | null;
  isModalOpen: boolean;
  openModal: (post: Post) => void;
  closeModal: () => void;
}

interface ChartState {
  // Chart view type
  chartViewType: ChartViewType;
  setChartViewType: (type: ChartViewType) => void;
}

type UIState = PostsTableState & ModalState & ChartState;

export const useUIStore = create<UIState>(set => ({
  // Pagination
  page: 1,
  pageSize: 10,
  setPage: page => set({ page }),
  setPageSize: pageSize => set({ pageSize, page: 1 }), // Reset to page 1 when changing size
  resetPage: () => set({ page: 1 }),

  // Platform filter
  platformFilter: PlatformFilter.All,
  setPlatformFilter: platformFilter => set({ platformFilter, page: 1 }), // Reset page on filter change

  // Sorting
  sortColumn: "posted_at",
  sortDirection: SortDirection.Desc,
  setSorting: (sortColumn, sortDirection) => set({ sortColumn, sortDirection, page: 1 }), // Reset page on sort change

  // Modal
  selectedPost: null,
  isModalOpen: false,
  openModal: post => set({ selectedPost: post, isModalOpen: true }),
  closeModal: () => set({ selectedPost: null, isModalOpen: false }),

  // Chart
  chartViewType: ChartViewType.Area,
  setChartViewType: chartViewType => set({ chartViewType }),
}));

// Selector hooks for better performance (only re-render when specific state changes)
export const usePostsTableState = () =>
  useUIStore(
    useShallow(state => ({
      page: state.page,
      pageSize: state.pageSize,
      platformFilter: state.platformFilter,
      sortColumn: state.sortColumn,
      sortDirection: state.sortDirection,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      setPlatformFilter: state.setPlatformFilter,
      setSorting: state.setSorting,
    })),
  );

export const useModalState = () =>
  useUIStore(
    useShallow(state => ({
      selectedPost: state.selectedPost,
      isModalOpen: state.isModalOpen,
      openModal: state.openModal,
      closeModal: state.closeModal,
    })),
  );

export const useChartState = () =>
  useUIStore(
    useShallow(state => ({
      chartViewType: state.chartViewType,
      setChartViewType: state.setChartViewType,
    })),
  );
