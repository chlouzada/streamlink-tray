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
import { getThumbnailSrc } from '../utils/getThumbnailSrc';
import { useStream } from '../hooks/useStream';
import { api } from '../utils/api';

const LiveRecentItem = ({
  username,
  displayName,
  game,
  title,
  avatarUrl,
  thumbnailUrl,
}: {
  username: string;
  displayName: string;
  game: string;
  title: string;
  avatarUrl: string;
  thumbnailUrl: string;
}) => {
  const { removeRecent } = useRecentStore();
  const { start } = useStream();

  return (
      <a href="#" className="hover:scale-[1.005] border border-gray-300 rounded-lg px-2 py-1"  onClick={() => start(username)}>
        <HoverCard.Root>
          <Flex gap="3" align="center">
            <HoverCard.Trigger>
              <Avatar
                size="2"
                src={avatarUrl}
                radius="full"
                fallback={username[0]!}
              />
            </HoverCard.Trigger>
            <Box>
              <Flex className="items-center">
                <div className="rounded-full h-2 w-2 mr-1.5 bg-red-500" />
                <Text size="2" weight="bold">
                  {displayName}
                </Text>
              </Flex>
              <Text as="div" size="1" color="gray" className="mb-0.5">
                Playing {game}
              </Text>
              <Text as="div" size="1" weight="medium">
                {title}
              </Text>
            </Box>

            <IconButton
              className="ml-auto"
              size="1"
              onClick={(e) => {
                e.stopPropagation();
                removeRecent(username);
              }}
              color="red"
            >
              <Cross2Icon />
            </IconButton>
          </Flex>

          <HoverCard.Content>
            <img
              src={getThumbnailSrc({
                url: thumbnailUrl,
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
        </HoverCard.Root>
      </a>
  );
};

const OfflineRecentItem = ({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) => {
  const { removeRecent } = useRecentStore();

  return (
      <div className='border border-gray-300 rounded-lg px-2 py-1'>
        <div className="w-full flex justify-between grow">
          <Flex className="items-center">
            <Text size="2" weight="bold">
              {displayName ?? username}
            </Text>
          </Flex>

          <IconButton
            className="ml-auto"
            size="1"
            onClick={(e) => {
              e.stopPropagation();
              removeRecent(username);
            }}
            color="red"
          >
            <Cross2Icon />
          </IconButton>
        </div>
      </div>
  );
};

const RecentItem = ({ name }: { name: string }) => {
  const { data: streamer } = useQuery({
    queryKey: ['streamer', name],
    queryFn: async () => api.streamer(name),
  });

  const { data: stream } = useQuery({
    queryKey: ['stream', name],
    queryFn: async () => api.stream(name),
    refetchInterval: 1000 * 60 * 5,
  });

  const isStreaming = !!stream?.type;

  return isStreaming ? (
    <LiveRecentItem
      username={streamer?.login ?? name}
      displayName={streamer?.display_name ?? name}
      avatarUrl={streamer?.profile_image_url ?? ''}
      game={stream.game_name}
      title={stream.title}
      thumbnailUrl={stream.thumbnail_url}
    />
  ) : (
    <OfflineRecentItem
      username={streamer?.login ?? name}
      displayName={streamer?.display_name ?? name}
    />
  );
};

export const Recents = () => {
  const { recents, clearAllRecents } = useRecentStore();
  const { closeAll } = useStream();

  if (recents.length === 0)
    return (
      <Button size="1" onClick={closeAll} className="w-full mt-2">
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
          <Button size="1" onClick={closeAll} className="w-full">
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
