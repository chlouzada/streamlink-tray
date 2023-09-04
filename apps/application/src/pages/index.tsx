import { useState } from 'react';
import { Container, Button, TextField } from '@radix-ui/themes';
import { Login } from '../components/Login';
import { useStream } from '../hooks/useStream';

function App() {
  const [name, setName] = useState('');
  const { start } = useStream();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !name.trim().length) return;
    start(name);
  };
  return (
    <Container className="min-h-screen flex flex-col justify-center" size="1">
      <></>
      <Login/>

      {/* <form className="flex justify-center gap-2 mb-2" onSubmit={handleSubmit}>
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
      <Recents /> */}
    </Container>
  );
}

export default App;
