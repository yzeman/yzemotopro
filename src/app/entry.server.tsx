import { renderToString } from 'react-dom/server';
import { ServerRouter } from 'react-router';
import App from './root';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
) {
  const html = renderToString(
    <ServerRouter>
      <App />
    </ServerRouter>
  );

  return new Response(`<!DOCTYPE html>${html}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
