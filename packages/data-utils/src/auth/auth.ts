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
  BETTER_AUTH_SECRET: string
}

export type Auth = ReturnType<typeof createAuth>

let auth: Auth | undefined;

export function createAuth(env: AuthEnv) {
  const db = getDb();
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const trustedOrigins = env.TRUSTED_ORIGINS.split(',').map((o: string) => o.trim());
  const secret = env.BETTER_AUTH_SECRET;
  return betterAuth({
    secret,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
      
    }),
    trustedOrigins,
    socialProviders: {
      google: {
        clientId,
        clientSecret,
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
    advanced:{
      ipAddress:  {ipAddressHeaders: ["cf-connecting-ip"] }
    }
  })
}


export function getAuth(env: AuthEnv) {

  if (auth) return auth;

  auth = createAuth(env);

  return auth;
}
