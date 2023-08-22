import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';

function App() {
  const [name, setName] = useState('');

  async function open_stream(name: string) {
    await invoke('open_stream', { input: name });
  }

  return (
    <div className="container">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          open_stream(name);
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a username..."
        />
        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default App;
