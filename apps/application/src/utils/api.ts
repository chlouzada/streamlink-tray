// const baseApiUrl = 'https://streamlink-tray.vercel.app/api';
const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

type Streamer = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
};

type Stream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: boolean;
};

export type User = {
  username: string;
  avatarUrl: string;
  displayName: string;
  status: 'LIVE' | 'OFFLINE';
  game?: string;
  title?: string;
  thumbnailUrl?: string;
};

export const api = {
  streamer: async (username: string) => {
    const result = await fetch(baseApiUrl + '/streamer?username=' + username, {
      method: 'GET',
    });
    const data: Streamer[] = await result.json();
    return data[0] ?? null;
  },

  stream: async (username: string) => {
    const result = await fetch(baseApiUrl + '/stream?username=' + username, {
      method: 'GET',
    });
    const data: Stream[] = await result.json();
    return data[0] ?? null;
  },

  v2: {
    user: async (username: string[]) => {
      const query = username.map((name) => `username=${name}`).join('&');
      const result = await fetch(`${baseApiUrl}/v2/user?${query}`, {
        method: 'GET',
      });
      const data: {
        [key: string]: User;
      } = await result.json();
      return data;
    },
  },
};
