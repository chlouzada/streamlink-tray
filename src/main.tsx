import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import App from './App';

import '@radix-ui/themes/styles.css';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme
      accentColor="iris"
      grayColor="gray"
      panelBackground="solid"
      radius="large"
    >
      <App />
    </Theme>
  </React.StrictMode>
);
