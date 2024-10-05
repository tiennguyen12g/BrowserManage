import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import electronSync from './middleware';

type FishState = {
  fish: number;
  increasePopulation: () => void;
  removeAllFish: () => void;
};

export const useFishStore = create<FishState, [['zustand/devtools', never]]>(
  electronSync(
    devtools(
      (set) => ({
        fish: 0,
        increasePopulation: () =>
          set(
            (state) => ({ fish: state.fish + 1 }),
            false,
            'increasePopulation'
          ),
        removeAllFish: () => set({ fish: 0 }),
      }),
      {
        name: 'Fish Store',
      }
    ),
    { key: 'fish-store', excludes: [] }
  )
);

export default useFishStore;