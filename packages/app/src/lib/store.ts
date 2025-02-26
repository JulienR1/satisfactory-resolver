import { create } from "zustand";

type Store = {
  calculateRates: () => void;
  setCalculateRates: (calculateRates: () => void) => void;
};

export const useStore = create<Store>()((set) => ({
  calculateRates: () => {},
  setCalculateRates: (callback: () => void) => set({ calculateRates: callback }),
}));
