type AuthFetcher = { fetch: (request: Request) => Promise<Response> };

/**
 * Forward an `/api/auth/*` request to the api-service worker that runs Better Auth.
 * Each app's `api/auth/$` route calls this with its own `env.API_SERVICE` binding.
 */
export async function proxyAuthRequest(
	request: Request,
	fetcher: AuthFetcher,
): Promise<Response> {
	const res = await fetcher.fetch(request);
	return new Response(res.body, { status: res.status, headers: res.headers });
}
