import { invoke } from '@tauri-apps/api';

export const callRust = {
  openStream: async (name: string) => {
    await invoke<void>('open_stream', { input: name });
  },
  closeAllStreams: () => invoke<void>('close_all_streams'),
};
