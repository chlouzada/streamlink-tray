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
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

const useStart = () => {
  const { addRecent } = useRecentStore();

  const start = async (name: string) => {
    await invoke('open_stream', { input: name });
    addRecent(name);
  };

  return { start };
};

const Recents = () => {
  const { recents, clearAllRecents, removeRecent } = useRecentStore();
  const { start } = useStart();

  if (recents.length === 0) return;

  return (
    <div className="flex flex-col gap-2">
      <ScrollArea type="always" scrollbars="vertical" style={{ height: 220 }}>
        <Flex pr="4" direction="column" gap="1">
          {recents.map((name) => (
            <Card asChild className="p-1">
              <a href="#" onClick={() => start(name)}>
                <Flex gap="3" align="center">
                  <Avatar
                    size="2"
                    src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                    radius="full"
                    fallback="T"
                  />
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      {name}
                    </Text>
                    <Text as="div" size="1" color="gray">
                      {/* TODO: */}
                      Playing...
                    </Text>
                  </Box>

                  <IconButton
                    className="ml-auto"
                    size="1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecent(name);
                    }}
                  >
                    <Cross2Icon />
                  </IconButton>
                </Flex>
              </a>
            </Card>
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
    if (!name) return;
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
