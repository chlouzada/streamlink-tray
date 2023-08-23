import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

import '@radix-ui/themes/styles.css';
import './styles.css';

const queryClient = new QueryClient();

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
