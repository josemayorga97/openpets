import { env } from "cloudflare:workers";
import { proxyAuthRequest } from "@repo/auth/proxy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: ({ request }) => proxyAuthRequest(request, env.API_SERVICE),
			POST: ({ request }) => proxyAuthRequest(request, env.API_SERVICE),
		},
	},
});
