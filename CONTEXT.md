# Context

Glossary of canonical terms used in this project. Implementation details
belong in code or ADRs, not here.

## Apps and workers

- **Frontend worker** — a Cloudflare Worker that serves one of the three
  user-facing apps (`admin-application`, `shelter-application`,
  `user-application`). Each frontend worker
  serves both static assets (via Workers Static Assets) and SSR routes
  rendered by TanStack Start. There are three of them, one per app, each
  deployed independently.

- **API worker** — a single Cloudflare Worker (`apps/api`) that owns all
  domain logic, authentication, authorization, and database access. It is
  not exposed on a public custom domain; frontend workers reach it via a
  service binding. It can be reached from the browser only indirectly,
  through `/api/*` paths on a frontend worker that proxy to it.

- **Service binding** — the Cloudflare mechanism by which a frontend
  worker calls the API worker in-process (no public network hop). All
  frontend → API traffic uses this.

## Apps

- **admin-application** — internal operations app, served at
  `admin.openpets.org` in prod.
- **shelter-application** — app used by partner shelters, served at
  `shelter.openpets.org` in prod.
- **user-application** — public-facing app for adopters, served at
  `www.openpets.org` (the apex `openpets.org` is the user app) in prod.

## Environments

- **prod** — public custom domains under `openpets.org`.
- **stage** — exposed only via the Cloudflare-generated `*.workers.dev`
  URLs of each worker. No custom domain. Each `stage` frontend worker
  service-binds to the `stage` API worker.

## Auth

- **Identity provider** — Better Auth with Google as the OAuth provider.
  Sessions are stored in the project's own database (no third-party
  hosted auth service).

- **Auth handler** — the Better Auth handler is mounted on the API
  worker. The API worker is the single place that issues, validates,
  and revokes sessions. Frontend workers do not run Better Auth
  themselves; they proxy `/api/auth/*` to the API worker via the
  service binding.

- **Session cookie** — set by the API worker in the response, but flows
  back to the browser through the frontend worker, so from the
  browser's perspective the cookie is first-party to the frontend's
  subdomain (e.g. `admin.openpets.org`).

- **Cross-app session sharing** — out of scope for the initial design
  on stage, since `*.workers.dev` URLs are independent cookie scopes.
  In prod, sharing across `*.openpets.org` subdomains is possible but
  not assumed; treat each app as having its own session unless an ADR
  says otherwise.

## Request shapes

- **SSR page load** — browser → frontend worker → (service binding) →
  API worker → DB. Frontend worker renders HTML and returns it. The API
  worker is never directly contacted by the browser.

- **Client-side mutation / data call** — browser → `/api/*` on the
  frontend worker's origin → (service binding) → API worker. The
  frontend worker proxies these so the browser never crosses an origin
  and cookies remain first-party.
