import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    if (!env.SANITY_WEBHOOK_SECRET || !env.GITHUB_TOKEN) {
      return new Response('Webhook not configured', { status: 503 });
    }

    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    const body = await request.text();

    if (!signature || !(await isValidSignature(body, signature, env.SANITY_WEBHOOK_SECRET))) {
      return new Response('Unauthorized', { status: 401 });
    }

    const response = await fetch(
      'https://api.github.com/repos/mcrumbum98-ai/matt-in-the-mountains/actions/workflows/deploy.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'basecamp-publish-webhook'
        },
        body: JSON.stringify({ ref: 'cms-staging' })
      }
    );

    if (!response.ok) {
      console.error('GitHub dispatch failed:', response.status);
      return new Response('Deployment trigger failed', { status: 502 });
    }

    return new Response('Deployment requested', { status: 202 });
  }
};
