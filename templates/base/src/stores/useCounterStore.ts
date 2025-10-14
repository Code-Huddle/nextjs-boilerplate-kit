import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (count: number) => void;
};

export const useCounterStore = create<CounterState>((set: any) => ({
  count: 0,
  increment: () => set((state: CounterState) => ({ count: state.count + 1 })),
  decrement: () => set((state: CounterState) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (count: number) => set({ count }),
}));
