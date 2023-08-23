import {
  Button,
  ScrollArea,
  Flex,
  Avatar,
  Box,
  Card,
  HoverCard,
  IconButton,
  Text,
} from '@radix-ui/themes';
import { useRecentStore } from '../stores/recentStore';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { callRust } from '../utils/callRust';
import { getThumbnailSrc } from '../utils/getThumbnailSrc';
import { useStartStream } from '../hooks/useStartStream';
import { api } from '../utils/api';

const RecentItem = ({ name }: { name: string }) => {
  const { removeRecent } = useRecentStore();
  const { start } = useStartStream();

  const queryStreamer = useQuery({
    queryKey: ['streamer', name],
    queryFn: async () => api.streamer(name),
  });

  const queryStream = useQuery({
    queryKey: ['stream', name],
    queryFn: async () => api.stream(name),
    refetchInterval: 1000 * 60 * 5,
  });

  const isStreaming = !!queryStream.data?.type;

  return (
    <Card asChild className="hover:scale-[1.005] ">
      <a href="#" onClick={() => start(name)}>
        <HoverCard.Root>
          <Flex gap="3" align="center">
            <HoverCard.Trigger>
              <Avatar
                className={
                  queryStreamer.isLoading
                    ? 'animate-pulse rounded-md bg-muted'
                    : ''
                }
                size="2"
                src={queryStreamer.data?.profile_image_url}
                radius="full"
                fallback={name[0]!}
              />
            </HoverCard.Trigger>
            <Box>
              <Flex className="items-center">
                <div
                  className={`rounded-full h-2 w-2 mr-1.5 ${
                    isStreaming ? 'bg-red-500' : 'bg-gray-200'
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

          {queryStream.data?.thumbnail_url && (
            <HoverCard.Content>
              <img
                src={getThumbnailSrc({
                  url: queryStream.data?.thumbnail_url,
                  width: 640,
                  height: 360,
                })}
                alt="stream thumbnail"
                style={{
                  display: 'block',
                  objectFit: 'cover',
                  height: '100%',
                  width: 150,
                  backgroundColor: 'var(--gray-5)',
                }}
              />
            </HoverCard.Content>
          )}
        </HoverCard.Root>
      </a>
    </Card>
  );
};

export const Recents = () => {
  const { recents, clearAllRecents } = useRecentStore();

  if (recents.length === 0)
    return (
      <Button
        size="1"
        onClick={callRust.closeAllStreams}
        className="w-full mt-2"
      >
        Close All Streams
      </Button>
    );

  return (
    <div className="flex flex-col gap-2">
      <ScrollArea type="always" scrollbars="vertical" style={{ height: 250 }}>
        <Flex direction="column" gap="1" className="pr-3 pl-[1px]">
          {recents.map((name) => (
            <RecentItem name={name} />
          ))}
        </Flex>
      </ScrollArea>
      <div className="flex grow gap-2">
        <div className="w-full">
          <Button
            size="1"
            onClick={callRust.closeAllStreams}
            className="w-full"
          >
            Close All Streams
          </Button>
        </div>
        <div className="w-full">
          <Button size="1" onClick={clearAllRecents} className="w-full">
            Clear History
          </Button>
        </div>
      </div>
    </div>
  );
};
