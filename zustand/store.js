
import { create } from "zustand";

export const useStore = create((set) => ({
    openCalender: false,
    setOpenCalender: () => set({ openCalender: true }),
    setCloseCalender: () => set({ openCalender: false})   
}));