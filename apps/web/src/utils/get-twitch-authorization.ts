/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-undef */

import { raises } from './raises';

class Cache {
  authorization: string;
  expires: number;
}

let cache: Cache | undefined;

const twitchClientId =
  process.env.TWITCH_CLIENT_ID ?? raises('TWITCH_CLIENT_ID not set');
const twitchClientSecret =
  process.env.TWITCH_CLIENT_SECRET ?? raises('TWITCH_CLIENT_SECRET not set');

export const getTwitchAuthorization = async (): Promise<string> => {
  if (cache && cache.expires > Date.now()) {
    return cache.authorization;
  }

  const result = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twitchClientSecret}&grant_type=client_credentials`,
    {
      method: 'POST',
    }
  );
  const data = (await result.json()) as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  cache = new Cache();
  cache.authorization = `${
    data.token_type[0].toUpperCase() + data.token_type.slice(1)
  } ${data.access_token}`;
  cache.expires = Date.now() + data.expires_in;

  return cache.authorization;
};
