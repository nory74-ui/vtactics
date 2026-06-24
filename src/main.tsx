import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress ResizeObserver loop limit exceeded error from Recharts
const suppressError = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (e) => {
      if (
        e.message === 'ResizeObserver loop limit exceeded' ||
        e.message === 'Script error.' ||
        e.message === 'ResizeObserver loop completed with undelivered notifications.'
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  }
};
suppressError();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
