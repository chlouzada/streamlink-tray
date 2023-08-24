import { getTwitchAuthorization } from '@/utils/getTwitchAuthorization';
import { NextResponse } from 'next/server';

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

const cache = new Map<string, { data: Stream; expires: number }>();

const getStreamsFromCache = (usernames: string[]) => {
  const result: Stream[] = [];
  for (const name of usernames) {
    const cached = cache.get(name);

    if (cached && cached.expires > Date.now()) {
      result.push(cached.data);
    }
  }
  return result;
};

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.split('?').pop());
  const usernames = params.getAll('username');

  if (usernames.length === 0) {
    return NextResponse.json([]);
  }

  const cachedStreams = getStreamsFromCache(usernames);

  if (cachedStreams.length === usernames.length) {
    return NextResponse.json(cachedStreams);
  }

  const filteredNames = usernames.filter((item) => {
    const cached = cache.get(item);
    if (cached && cached.expires > Date.now()) {
      return false;
    }
    return true;
  });

  const toQuery = filteredNames.map((item) => `user_login=${item}`).join('&');

  const result = await fetch('https://api.twitch.tv/helix/streams?' + toQuery, {
    method: 'GET',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID!,
      Authorization: await getTwitchAuthorization(),
    },
  });

  const data: {
    data: Stream[];
  } = await result.json();

  const fetchedStreams = data.data;

  for (const streamer of fetchedStreams) {
    cache.set(streamer.user_login, {
      data: streamer,
      expires: Date.now() + 1000 * 60 * 5,
    });
  }

  return NextResponse.json([...cachedStreams, ...fetchedStreams]);
}
