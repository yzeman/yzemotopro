import { type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  return new Response('Utils API', { status: 200 });
}

export async function action({ request }: ActionFunctionArgs) {
  return new Response('Method not allowed', { status: 405 });
}
