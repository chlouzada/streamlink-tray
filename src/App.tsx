import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';

function App() {
  const [name, setName] = useState('');

  async function open_stream(name: string) {
    console.log('aqui', name);
    await invoke('open_stream', { input: name });
    console.log('after');
  }

  return (
    <div className="flex flex-col justify-center h-full">
      <form
        className="flex justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          open_stream(name);
        }}
      >
        <input
          className="mr-2"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a username..."
        />
        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default App;
