import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme, Container } from '@radix-ui/themes';
import App from './App';

import './styles.css';
import '@radix-ui/themes/styles.css';

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
