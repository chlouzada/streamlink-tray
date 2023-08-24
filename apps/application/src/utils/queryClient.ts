import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

const cacheTime = 1000 * 60 * 60 * 24; // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
      staleTime: 5000,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  deserialize: (data) => {
    console.log('faeadawdfeafae');
    return JSON.parse(data);
  },
});

persistQueryClient({
  queryClient,
  persister,
});
