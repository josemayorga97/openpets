import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import * as schema from '@repo/data-utils/schema'
import {
  createAdoptionApplication,
  createAdoptionForm,
  getActiveAttachments,
  getApplicationsByApplicant,
  getAdoptionForm,
  markAttachmentUploaded,
} from '@repo/data-utils/queries/applications'
import {
  createAdoptionApplicationSchema,
  createAdoptionFormSchema,
} from '@repo/data-utils/zod-schema/applications'
import type { AppEnv } from '../env'
import { requireApplicantOwner, requireSession } from '../middleware/auth'
import { zJson } from '../middleware/validate'

// Applicant-facing endpoints only. Shelter-side review/decision lives at
// /me/applications/*.
const createAppBody = createAdoptionApplicationSchema.omit({ applicantId: true })
const createFormBody = createAdoptionFormSchema.omit({ applicationId: true })

export const applicationsRouter = new Hono<AppEnv>()
  .post('/', requireSession, zJson(createAppBody), async (c) => {
    const id = await createAdoptionApplication({
      ...c.req.valid('json'),
      applicantId: c.var.user!.id,
    })
    return c.json({ id })
  })
  .get('/by-applicant/me', requireSession, async (c) => {
    const items = await getApplicationsByApplicant(c.var.user!.id)
    return c.json({ items })
  })
  .get('/:id', requireSession, requireApplicantOwner, async (c) => {
    return c.json(c.var.application!)
  })
  .post(
    '/:id/form',
    requireSession,
    requireApplicantOwner,
    zJson(createFormBody),
    async (c) => {
      const formId = await createAdoptionForm({
        ...c.req.valid('json'),
        applicationId: c.var.application!.id,
      })
      return c.json({ id: formId })
    },
  )
  .get('/:id/form', requireSession, requireApplicantOwner, async (c) => {
    const form = await getAdoptionForm(c.var.application!.id)
    if (!form) return c.json({ error: 'not_found' }, 404)
    return c.json(form)
  })
  .get('/:id/attachments', requireSession, requireApplicantOwner, async (c) => {
    const items = await getActiveAttachments(c.var.application!.id)
    return c.json({ items })
  })
  .post('/attachments/:attachmentId/uploaded', requireSession, async (c) => {
    const attachmentId = c.req.param('attachmentId')
    const db = drizzle(c.env.DB, { schema })
    const rows = await db
      .select({ applicantId: schema.adoptionApplication.applicantId })
      .from(schema.adoptionFormAttachment)
      .innerJoin(
        schema.adoptionApplication,
        eq(
          schema.adoptionApplication.id,
          schema.adoptionFormAttachment.applicationId,
        ),
      )
      .where(eq(schema.adoptionFormAttachment.id, attachmentId))
      .limit(1)
    const found = rows[0]
    if (!found) return c.json({ error: 'not_found' }, 404)
    if (found.applicantId !== c.var.user!.id) {
      return c.json({ error: 'forbidden' }, 403)
    }
    await markAttachmentUploaded(attachmentId)
    return c.json({ ok: true })
  })
