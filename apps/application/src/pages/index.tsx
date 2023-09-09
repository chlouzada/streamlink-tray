import { useState } from 'react';
import { Button, TextField } from '@radix-ui/themes';
import { useStream } from '../hooks/useStream';
import { Recents } from '../components/Recents';
import { Link } from '../router';

function Home() {
  const [name, setName] = useState('');
  const { start } = useStream();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !name.trim().length) return;
    start(name);
  };
  
  return (
    <>
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
      <Link to="/teste">to teste 2</Link>
      <Recents />
    </>
  );
}

export default Home;
