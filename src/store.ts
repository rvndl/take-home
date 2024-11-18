import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  deletedCardIds: number[];
  expandedCardIds: number[];
};

type Actions = {
  addDeletedCard: (id: number) => void;
  addExpandedCard: (id: number) => void;
  removeExpandedCard: (id: number) => void;
};

export const useStore = create(
  persist<State & Actions>(
    (set) => ({
      deletedCardIds: [],
      expandedCardIds: [],
      addDeletedCard: (id) =>
        set((state) => ({ deletedCardIds: [...state.deletedCardIds, id] })),
      addExpandedCard: (id) =>
        set((state) => ({ expandedCardIds: [...state.expandedCardIds, id] })),
      removeExpandedCard: (id) =>
        set((state) => ({
          expandedCardIds: state.expandedCardIds.filter((item) => item !== id),
        })),
    }),
    { name: "card-store", storage: createJSONStorage(() => localStorage) }
  )
);
