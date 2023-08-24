/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NextResponse } from 'next/server';
import { getTwitchAuthorization } from '../../../utils/get-twitch-authorization';

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

const cache = new Map<string, { data: Streamer; expires: number }>();

const getStreamersFromCache = (usernames: string[]) => {
  const result: Streamer[] = [];
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

  const cachedStreamers = getStreamersFromCache(usernames);

  if (cachedStreamers.length === usernames.length) {
    return NextResponse.json(cachedStreamers);
  }

  const filteredNames = usernames.filter((name) => {
    const cached = cache.get(name);
    if (cached && cached.expires > Date.now()) {
      return false;
    }
    return true;
  });

  const toQuery = filteredNames.map((name) => `login=${name}`).join('&');

  const result = await fetch(`https://api.twitch.tv/helix/users?${toQuery}`, {
    method: 'GET',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID!,
      Authorization: await getTwitchAuthorization(),
    },
  });

  const data = (await result.json()) as {
    data: Streamer[];
  };

  const fetchedStreamers = data.data;

  for (const streamer of fetchedStreamers) {
    cache.set(streamer.login, {
      data: streamer,
      expires: Date.now() + 1000 * 60 * 60,
    });
  }

  return NextResponse.json([...cachedStreamers, ...fetchedStreamers]);
}
