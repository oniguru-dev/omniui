import { Elysia } from 'elysia';

export default new Elysia()
  .onBeforeHandle(({ path, headers }) => {
    // Example: log all requests
    console.log(`[${new Date().toISOString()}] ${path}`);

    // Example: block bots
    const ua = headers['user-agent'] || '';
    if (ua.includes('bot') || ua.includes('crawler'))
      return new Response('Forbidden', { status: 403 });
  });
