import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  deletedCardIds: number[];
  expendedCardIds: number[];
};

type Actions = {
  addDeletedCard: (id: number) => void;
  addExpendedCard: (id: number) => void;
  removeExpendedCard: (id: number) => void;
};

export const useStore = create(
  persist<State & Actions>(
    (set) => ({
      deletedCardIds: [],
      expendedCardIds: [],
      addDeletedCard: (id) =>
        set((state) => ({ deletedCardIds: [...state.deletedCardIds, id] })),
      addExpendedCard: (id) =>
        set((state) => ({ expendedCardIds: [...state.expendedCardIds, id] })),
      removeExpendedCard: (id) =>
        set((state) => ({
          expendedCardIds: state.expendedCardIds.filter((item) => item !== id),
        })),
    }),
    { name: "card-store", storage: createJSONStorage(() => localStorage) }
  )
);
