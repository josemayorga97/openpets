import type { getPet } from '@repo/data-utils/queries/pets'
import type { getAdoptionApplication } from '@repo/data-utils/queries/applications'
import type { Auth } from '@repo/data-utils/auth'

export type ShelterContext = {
  id: string
  status: 'pending' | 'active' | 'suspended'
}

// Row shapes are derived from the query functions so they track the schema
// without manual restatement.
export type PetRow = NonNullable<Awaited<ReturnType<typeof getPet>>>
export type ApplicationRow = NonNullable<
  Awaited<ReturnType<typeof getAdoptionApplication>>
>
export type SessionUser = NonNullable<
  Awaited<ReturnType<Auth['api']['getSession']>>
>['user']

export type Variables = {
  // Populated by the auth-n middleware.
  user?: SessionUser
  shelter?: ShelterContext
  pet?: PetRow
  application?: ApplicationRow
}

export type AppEnv = {
  Bindings: Env;
  Variables: Variables
}
