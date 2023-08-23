import { useRecentStore } from '../stores/recentStore';
import { callRust } from '../utils/callRust';

export const useStartStream = () => {
  const { addRecent } = useRecentStore();

  return {
    start: async (name: string) => {
      await callRust.openStream(name);
      addRecent(name);
    },
  };
};
