import { useRecentStore } from '../stores/recentStore';
import { callRust } from '../utils/callRust';
import { toast } from 'react-toastify';

export const useStream = () => {
  const { addRecent } = useRecentStore();

  return {
    start: async (name: string) => {
      await callRust.openStream(name);
      toast(`Opening ${name}'s stream`);
      addRecent(name);
    },
    closeAll: async () => {
      await callRust.closeAllStreams();
      toast(`Closing all streams...`);
    },
  };
};
