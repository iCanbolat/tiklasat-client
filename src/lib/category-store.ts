import { create } from "zustand";

export type CategoryViewTab = "grid" | "tree";

interface CategoryStore {
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  selectedCategoryId: string | null;
  // View state
  activeTab: CategoryViewTab;
  setActiveTab: (tab: CategoryViewTab) => void;
  viewCategoryDetails: (id: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  modal: false,
  isCreateModalOpen: false,
  // View state
  activeTab: "tree",
  selectedCategoryId: null,

  setActiveTab: (tab: CategoryViewTab) => {
    set({ activeTab: tab });
  },

  viewCategoryDetails: (id: string) => {
    set({
      selectedCategoryId: id,
      activeTab: "tree",
    });
  },
  openCreateModal: () => {
    set({ isCreateModalOpen: true });
  },

  closeCreateModal: () => {
    set({ isCreateModalOpen: false });
  },
}));
