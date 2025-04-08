import type { ICategory } from "@/routes/dashboard/categories/-types";
import { create } from "zustand";

interface CategoryStore {
  selectedCategory: ICategory | null;
  selectCategory: (category: ICategory) => void;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: null,
  modal: false,
  isCreateModalOpen: false,

  openCreateModal: () => {
    set({ isCreateModalOpen: true });
  },

  closeCreateModal: () => {
    set({ isCreateModalOpen: false });
    // get().resetNewCategoryForm();
  },

  selectCategory: (category: ICategory) => {
    set({ selectedCategory: category });
  },
}));
