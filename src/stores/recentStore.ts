import { create } from 'zustand';

const RECENTS_KEY = 'recents';

type RecentsState = {
  recents: string[];
  addRecent: (recent: string) => void;
  removeRecent: (recent: string) => void;
  clearAllRecents: () => void;
};

export const useRecentStore = create<RecentsState>((set) => ({
  recents: JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]') as string[],
  addRecent: (recent) =>
    set((state) => {
      const set = new Set([recent, ...state.recents]);
      const unique = [...set];
      localStorage.setItem(RECENTS_KEY, JSON.stringify(unique));
      return { recents: unique };
    }),
  removeRecent: (recent) =>
    set((state) => {
      localStorage.setItem(
        RECENTS_KEY,
        JSON.stringify(state.recents.filter((r) => r !== recent))
      );
      return { recents: state.recents.filter((r) => r !== recent) };
    }),
  clearAllRecents: () => {
    set({ recents: [] });
    localStorage.removeItem(RECENTS_KEY);
  },
}));
