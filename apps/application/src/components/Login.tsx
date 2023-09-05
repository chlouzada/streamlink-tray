export const Login = () => {
  const url = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${
    import.meta.env.VITE_TWITCH_CLIENT_ID
  }&redirect_uir=${window.location.origin}
  &scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls`;

  return <a href={url}>Connaaaect with Twitch</a>;
};
