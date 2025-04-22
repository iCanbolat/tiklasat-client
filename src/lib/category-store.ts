import { create } from "zustand";

interface CategoryStore {
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  modal: false,
  isCreateModalOpen: false,

  openCreateModal: () => {
    set({ isCreateModalOpen: true });
  },

  closeCreateModal: () => {
    set({ isCreateModalOpen: false });
  },
}));
