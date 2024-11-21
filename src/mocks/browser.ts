import { setupWorker } from 'msw/browser'
import { handlers } from '../__mocks__/handlers';

export const worker = setupWorker(...handlers);

// Start the worker
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass', // Ignore unhandled requests in development
  });
}
