let cache: {
  authorization: string;
  expires: number;
} | undefined;

export const getTwitchAuthorization = async () => {
  if (cache && cache.expires > Date.now()) {
    return cache.authorization;
  }

  const result = await fetch(
    'https://id.twitch.tv/oauth2/token?client_id=' +
      process.env.TWITCH_CLIENT_ID +
      '&client_secret=' +
      process.env.TWITCH_CLIENT_SECRET +
      '&grant_type=client_credentials',
    {
      method: 'POST',
    }
  );
  const data = (await result.json()) as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  cache = {
    authorization: `${
      data.token_type[0].toUpperCase() + data.token_type.slice(1)
    } ${data.access_token}`,
    expires: Date.now() + data.expires_in,
  };

  return cache.authorization;
};
