// src/app/entry.server.tsx
import { renderToString } from 'react-dom/server';
import { ServerRouter } from 'react-router';
import App from './root';

export default function handleRequest() {
  const html = renderToString(
    <ServerRouter>
      <App />
    </ServerRouter>
  );
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
