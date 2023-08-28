import { create } from 'zustand';
import { toast } from 'react-toastify';

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
      const arr = [...new Set([recent, ...state.recents])].slice(0, 10);
      localStorage.setItem(RECENTS_KEY, JSON.stringify(arr));
      return { recents: arr };
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
    toast(`Cleared all recents`);
  },
}));
