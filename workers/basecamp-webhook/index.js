
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

    if (!signature || !(await isValidSignature(body, signature, 
env.SANITY_WEBHOOK_SECRET))) {
      return new Response('Unauthorized', { status: 401 });
    }

    const url = 
'https://api.github.com/repos/mcrumbum98-ai/matt-in-the-mountains/actions/workflows/deploy.yml/dispatches';

    const branches = ['cms-staging', 'main'];

    const results = await Promise.all(
      branches.map(async (branch) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.GITHUB_TOKEN}`,
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
              'User-Agent': 'basecamp-publish-webhook'
            },
            body: JSON.stringify({ ref: branch })
          });

          return { branch, success: response.ok, status: response.status 
};
        } catch (error) {
          console.error(`GitHub dispatch error for ${branch}:`, error);
          return { branch, success: false, status: 0 };
        }
      })
    );

    const failures = results.filter(result => !result.success);

    if (failures.length > 0) {
      console.error('GitHub dispatch failures:', failures);
      return new Response('One or more deployment triggers failed', { 
status: 502 });
    }

    return new Response('Staging and production deployments requested', { 
status: 202 });
  }
};

