import { validator } from 'hono/validator'
import type { ZodType } from 'zod'

export const zJson = <S extends ZodType>(schema: S) =>
  validator('json', (value, c) => {
    const r = schema.safeParse(value)
    if (!r.success) return c.json({ error: r.error.flatten() }, 400)
    return r.data as ReturnType<S['parse']>
  })

export const zQuery = <S extends ZodType>(schema: S) =>
  validator('query', (value, c) => {
    const r = schema.safeParse(value)
    if (!r.success) return c.json({ error: r.error.flatten() }, 400)
    return r.data as ReturnType<S['parse']>
  })
