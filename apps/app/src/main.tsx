import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';

import '@radix-ui/themes/styles.css';
import './styles.css';
import { queryClient } from './utils/queryClient';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme
        accentColor="iris"
        grayColor="gray"
        panelBackground="solid"
        radius="large"
      >
        <App />
      </Theme>
    </QueryClientProvider>
  </React.StrictMode>
);
