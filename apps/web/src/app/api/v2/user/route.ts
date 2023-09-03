/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NextResponse } from 'next/server';
import { getStreams } from '../../stream/route';
import { getStreamers } from '../../streamer/route';
import { raises } from '../../../../utils/raises';

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

const cache = {
  stream: new Map<string, { data: Stream; expires: number }>(),
  streamer: new Map<string, { data: Streamer; expires: number }>(),
};

const getFromCache = <T extends typeof cache.stream | typeof cache.streamer>(
  usernames: string[],
  selectedCache: T
): T extends typeof cache.stream ? Stream[] : Streamer[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  for (const name of usernames) {
    const cached = selectedCache.get(name);
    if (cached && cached.expires > Date.now()) {
      result.push(cached.data);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
};

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.split('?').pop());
  const usernames = params.getAll('username');

  if (usernames.length === 0) {
    return NextResponse.json([]);
  }

  const cachedStreamers = getFromCache(usernames, cache.streamer);
  const cachedStreams = getFromCache(usernames, cache.stream);

  const [fetchedStreamers, fetchedStreams] = await Promise.all([
    runAsync(async () => {
      const toFetchStreamers = usernames.filter(
        (username) =>
          !cachedStreamers.map((item) => item.login).includes(username)
      );
      if (toFetchStreamers.length === 0) return [];
      return getStreamers(toFetchStreamers);
    }),
    runAsync(async () => {
      const toFetchStreams = usernames.filter(
        (username) =>
          !cachedStreams.map((item) => item.user_login).includes(username)
      );
      if (toFetchStreams.length === 0) return [];
      return getStreams(toFetchStreams);
    }),
  ]);
  
  for (const streamer of fetchedStreamers) {
    cache.streamer.set(streamer.login, {
      data: streamer,
      expires: Date.now() + 1000 * 60 * 60 * 24,
    });
  }

  for (const stream of fetchedStreams) {
    cache.stream.set(stream.user_login, {
      data: stream,
      expires: Date.now() + 1000 * 60 * 5,
    });
  }

  const streamers = [...cachedStreamers, ...fetchedStreamers];
  const streams = [...cachedStreams, ...fetchedStreams];

  

  const result = Object.fromEntries(
    usernames.map((username) =>{

      const streamer = streamers.find((item) => item.login === username) ?? raises('Streamer not found');
      const stream = streams.find((item) => item.user_login === username);

      return [username, {
        username: streamer.login,
        avatarUrl: streamer.profile_image_url,
        displayName: streamer.display_name,
        status: stream ? "LIVE" : "OFFLINE",
        game: stream?.game_name,
        title: stream?.title,
        thumbnailUrl: stream?.thumbnail_url,
      }]
    })
  );''

  return NextResponse.json(result);
}

const runAsync = async <T>(fn: () => Promise<T>) => fn();
