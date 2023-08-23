import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { useRecentStore } from './stores/recentStore';
import {
  Container,
  Button,
  Avatar,
  Box,
  Card,
  Flex,
  Text,
  TextField,
  ScrollArea,
  IconButton,
} from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';

const baseApiUrl = 'https://streamlink-tray.vercel.app/api';

const useStart = () => {
  const { addRecent } = useRecentStore();

  const start = async (name: string) => {
    await invoke('open_stream', { input: name });
    addRecent(name);
  };

  return { start };
};

const RecentItem = ({ name }: { name: string }) => {
  const { removeRecent } = useRecentStore();
  const { start } = useStart();

  const queryStreamer = useQuery({
    queryKey: ['streamer', name],
    queryFn: async () => {
      const result = await fetch(baseApiUrl + '/streamer?username=' + name, {
        method: 'GET',
      });
      const data: {
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
      }[] = await result.json();
      return data[0] ?? null;
    },
  });

  const queryStream = useQuery({
    queryKey: ['stream', name],
    queryFn: async () => {
      const result = await fetch(baseApiUrl + '/stream?username=' + name, {
        method: 'GET',
      });
      const data: {
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
      }[] = await result.json();
      return data[0] ?? null;
    },
  });

  const isStreaming = !!queryStream.data?.type;

  return (
    <Card asChild>
      <a href="#" onClick={() => start(name)}>
        <Flex gap="3" align="center">
          <Avatar
            className={
              queryStreamer.isLoading ? 'animate-pulse rounded-md bg-muted' : ''
            }
            size="2"
            src={queryStreamer.data?.profile_image_url}
            radius="full"
            fallback={name[0]!}
          />
          <Box>
            <Flex className="items-center">
              <div
                className={`rounded-full h-2 w-2 mr-1.5 ${
                  isStreaming ? 'bg-red-500' : 'bg-gray-300'
                }`}
              />
              <Text size="2" weight="bold">
                {queryStreamer.data?.display_name ?? name}
              </Text>
            </Flex>
            {isStreaming && (
              <>
                <Text as="div" size="1" color="gray" className="mb-0.5">
                  Playing {queryStream.data?.game_name}
                </Text>
                <Text as="div" size="1" weight="medium">
                  {queryStream.data?.title}
                </Text>
              </>
            )}
          </Box>

          <IconButton
            className="ml-auto"
            size="1"
            onClick={(e) => {
              e.stopPropagation();
              removeRecent(name);
            }}
            color="red"
          >
            <Cross2Icon />
          </IconButton>
        </Flex>
      </a>
    </Card>
  );
};

const Recents = () => {
  const { recents, clearAllRecents } = useRecentStore();

  if (recents.length === 0) return;

  return (
    <div className="flex flex-col gap-2">
      <ScrollArea type="always" scrollbars="vertical" style={{ height: 220 }}>
        <Flex pr="4" direction="column" gap="1">
          {recents.map((name) => (
            <RecentItem name={name} />
          ))}
        </Flex>
      </ScrollArea>
      <div className="flex w-full justify-end">
        <Button size="1" onClick={clearAllRecents}>
          Clear
        </Button>
      </div>
    </div>
  );
};

function App() {
  const [name, setName] = useState('');
  const { start } = useStart();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !name.trim().length) return;
    start(name);
  };

  return (
    <Container className="min-h-screen flex flex-col justify-center" size="1">
      <form className="flex justify-center gap-2 mb-2" onSubmit={handleSubmit}>
        <TextField.Root className="w-full">
          <TextField.Input
            size="3"
            placeholder="Twitch username"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </TextField.Root>
        <Button size="3" className="w-1/5" type="submit">
          Start
        </Button>
      </form>
      <Recents />
    </Container>
  );
}

export default App;
