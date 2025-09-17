// src/app/api/route.js
import { type LoaderFunctionArgs } from 'react-router';

export async function loader({ request }) {
  return new Response(JSON.stringify({ message: 'API is working' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function action({ request }) {
  return new Response('Method not allowed', { status: 405 });
}
