import { Hono } from 'hono'
import {
  createAdoptionApplication,
  createAdoptionForm,
  getActiveAttachments,
  getApplicationsByApplicant,
  getAdoptionForm,
  getAttachmentApplicantId,
  markAttachmentUploaded,
} from '@repo/data-utils/queries/applications'
import {
  createAdoptionApplicationSchema,
  createAdoptionFormSchema,
} from '@repo/data-utils/zod-schema/applications'
import type { AppEnv } from '../env'
import { requireApplicantOwner, requireSession } from '../middleware/auth'
import { zJson } from '../middleware/validate'
import { pickSafe } from '../logger/logger'

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
    c.var.logger.info('application.created', {
      ...pickSafe(c.var.user),
      applicationId: id,
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
      c.var.logger.info('form.created', {
        ...pickSafe(c.var.user),
        applicationId: c.var.application!.id,
        formId,
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
    const applicantId = await getAttachmentApplicantId(attachmentId)
    if (!applicantId) return c.json({ error: 'not_found' }, 404)
    if (applicantId !== c.var.user!.id) {
      return c.json({ error: 'forbidden' }, 403)
    }
    await markAttachmentUploaded(attachmentId)
    c.var.logger.info('attachment.uploaded', {
      ...pickSafe(c.var.user),
      attachmentId,
    })
    return c.json({ ok: true })
  })
