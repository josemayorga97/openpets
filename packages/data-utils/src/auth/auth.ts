import { betterAuth } from 'better-auth'
import { admin as adminPlugin } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb } from '@/db/database'
import * as schema from '@/db/auth-schema'
import { ac, admin, shelter, user } from './permissions'

// The subset of the worker environment the auth config needs. Declared here
// (rather than relying on the api-service's ambient `Env`) so this module is
// self-contained and any consumer that supplies these fields can use it.
export type AuthEnv = {
  TRUSTED_ORIGINS: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

export type Auth = ReturnType<typeof createAuth>

let auth: Auth | undefined;



export function createAuth(env: AuthEnv) {
  const db = getDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),
    trustedOrigins: env.TRUSTED_ORIGINS.split(',').map((o: string) => o.trim()),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    emailAndPassword: {
      enabled: false,
    },
    plugins: [
      adminPlugin({
        ac,
        roles: { admin, shelter, user },
        defaultRole: 'user',
        adminRoles: ['admin'],
      }),
    ],
  })
}


export function getAuth(env: AuthEnv) {

  if (auth) return auth;

  auth = createAuth(env);

  return auth;
}
