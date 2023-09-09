import {
  Button,
  ScrollArea,
  Flex,
  Avatar,
  Box,
  HoverCard,
  IconButton,
  Text,
} from '@radix-ui/themes';
import { useRecentStore } from '../stores/recentStore';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { getThumbnailSrc } from '../utils/getThumbnailSrc';
import { useStream } from '../hooks/useStream';
import { User, api } from '../utils/api';
import { useEffect } from 'react';


export const Login = () => {
  
  const url = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&redirect_uir=${window.location.origin}
  &scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls`;

  return (
    <a href={url}>Connect with Twitch</a>
  );
};