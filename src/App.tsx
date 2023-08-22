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
} from '@radix-ui/themes';

export const Recents = () => {
  const { recents, clearAllRecents } = useRecentStore();

  return (
    <ScrollArea type="always" scrollbars="vertical" style={{ height: 200 }}>
      <Box pr="4">
        {recents.map((name) => (
          <Card className="p-1">
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
                  Playing...
                </Text>
              </Box>
            </Flex>
          </Card>
        ))}
      </Box>
    </ScrollArea>
  );
};

function App() {
  const [name, setName] = useState('');
  const { addRecent } = useRecentStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) return;

    await invoke('open_stream', { input: name });
    addRecent(name);
  };

  return (
    <div className="flex flex-col h-full justify-center">
      <form className="flex justify-center gap-2 mb-6" onSubmit={handleSubmit}>
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
    </div>
  );
}

export default App;
