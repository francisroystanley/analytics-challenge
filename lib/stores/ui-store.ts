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

interface ModalState {
  // Modal
  selectedPost: Post | null;
  isModalOpen: boolean;
  openModal: (post: Post) => void;
  closeModal: () => void;
}

export const useUIStore = create<ModalState>(set => ({
  selectedPost: null,
  isModalOpen: false,
  openModal: post => set({ selectedPost: post, isModalOpen: true }),
  closeModal: () => set({ selectedPost: null, isModalOpen: false }),
}));

export const useModalState = () =>
  useUIStore(
    useShallow(state => ({
      selectedPost: state.selectedPost,
      isModalOpen: state.isModalOpen,
      openModal: state.openModal,
      closeModal: state.closeModal,
    })),
  );
