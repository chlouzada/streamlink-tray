import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';
import { useRecentStore } from './stores/recentStore';

export const Recents = () => {
  const { recents, clearAllRecents } = useRecentStore();

  return (
    <div className="flex flex-col mx-auto w-4/5 mt-4">
      <ul className="space-y-2">
        {recents.map((name) => (
          <li key={`recents-list-${name}`} className="flex w-full">
            <span className="w-full border">{name}</span>
          </li>
        ))}
      </ul>

      <button onClick={clearAllRecents}>clearAllRecents</button>
    </div>
  );
};

function App() {
  const [name, setName] = useState('');
  const { addRecent } = useRecentStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await invoke('open_stream', { input: name });
    addRecent(name);
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <form
        className="flex justify-center gap-2 mx-auto w-4/5"
        onSubmit={handleSubmit}
      >
        <input onChange={(e) => setName(e.currentTarget.value)} />
        <button type="submit">Start</button>
      </form>
      <Recents />
    </div>
  );
}

export default App;
