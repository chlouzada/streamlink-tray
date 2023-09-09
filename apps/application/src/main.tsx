import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { queryClient } from './utils/queryClient';

import '@radix-ui/themes/styles.css';
import './styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Cross2Icon } from '@radix-ui/react-icons';

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
        <ToastContainer
          {...{
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            hideProgressBar: true,
            position: 'bottom-center',
            theme: 'dark',
            style: {
              paddingLeft: 11,
              paddingRight: 11,
              paddingBottom: 4,
            },
            toastStyle: {
              borderRadius: 8,
            },
            closeButton(props) {
              return (
                <button type="button" onClick={props.closeToast}>
                  <Cross2Icon />
                </button>
              );
            },
            autoClose: 500,
          }}
        />
      </Theme>
    </QueryClientProvider>
  </React.StrictMode>
);
