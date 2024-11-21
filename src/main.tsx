import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

async function prepare() {
  // Initialize MSW in development only when using mock API
  if (import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL === 'mock') {
    const { worker } = await import('./mocks/browser')
    worker.start()
  }
  return Promise.resolve();
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
