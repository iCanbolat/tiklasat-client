import { create } from "zustand";

type LayoutStoreType = {
  isPending: boolean;
  setIsPending: (isPending: boolean) => void;
  formSubmitFn: (() => void) | null;
  deleteFn: (() => void) | null;
  setFormSubmitFn: (fn: () => void) => void;
  setDeleteFn: (fn: () => void) => void;
};

export const useLayoutStore = create<LayoutStoreType>((set) => ({
  formSubmitFn: null,
  deleteFn: null,
  isPending: false,

  setIsPending: (isPending) => set({ isPending }),
  setFormSubmitFn: (fn) => set({ formSubmitFn: fn }),
  setDeleteFn: (fn) => set({ deleteFn: fn }),
}));
