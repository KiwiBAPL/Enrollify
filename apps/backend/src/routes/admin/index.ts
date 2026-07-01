import { Router } from 'express'
import { z } from 'zod'
import type { Container } from '../../container.js'
import { buildAdminAnalytics } from '../../lib/adminAnalytics.js'
import {
  CHAT_QUESTION_CATEGORIES,
  isChatQuestionCategory,
} from '../../lib/questionCategories.js'
import { createAuthMiddleware } from '../../middleware/authJwt.js'
import { createAIProvidersRouter } from './aiProviders.js'
import type { EnrolmentStatus, LeadScore, Student } from '../../types/domain.js'

const ENROLMENT_STATUSES: EnrolmentStatus[] = [
  'enquiry',
  'qualified_lead',
  'appointment_booked',
  'application_submitted',
  'enrolled',
  'not_qualified',
]

const archiveStudentsSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
})

function parseNoteContent(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null
  const content = (body as { content?: unknown }).content
  if (typeof content !== 'string') return null
  const trimmed = content.trim()
  return trimmed.length > 0 ? trimmed : null
}

function defaultInsightsDateRange(): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  from.setUTCDate(from.getUTCDate() - 30)
  return { from: from.toISOString(), to: to.toISOString() }
}

function parseInsightsDateRange(
  from?: string,
  to?: string,
): { from?: string; to?: string } {
  if (!from && !to) return defaultInsightsDateRange()
  return { from, to }
}

export function createAdminRouter(container: Container): Router {
  const router = Router()
  const auth = createAuthMiddleware(container.db, container.repositories.staffProfiles)

  router.use(auth)

  router.use('/ai-providers', createAIProvidersRouter(container))

  router.get('/me', async (req, res, next) => {
    try {
      const profile = await container.repositories.staffProfiles.findById(req.auth!.userId)
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' })
        return
      }
      res.json({ profile })
    } catch (err) {
      next(err)
    }
  })

  function parseNameField(value: unknown): string | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  router.patch('/me', async (req, res, next) => {
    try {
      const body = req.body as {
        first_name?: unknown
        last_name?: unknown
        email?: unknown
      }

      const updates: { first_name?: string; last_name?: string; email?: string } = {}

      if (body.first_name !== undefined) {
        const firstName = parseNameField(body.first_name)
        if (!firstName) {
          res.status(400).json({ error: 'First name is required' })
          return
        }
        updates.first_name = firstName
      }

      if (body.last_name !== undefined) {
        const lastName = parseNameField(body.last_name)
        if (!lastName) {
          res.status(400).json({ error: 'Last name is required' })
          return
        }
        updates.last_name = lastName
      }

      if (body.email !== undefined) {
        if (typeof body.email !== 'string' || !body.email.trim()) {
          res.status(400).json({ error: 'Invalid email' })
          return
        }
        const email = body.email.trim().toLowerCase()
        if (email !== req.auth!.email.toLowerCase()) {
          res.status(400).json({ error: 'Email must match your authenticated account' })
          return
        }
        updates.email = email
      }

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: 'No valid fields to update' })
        return
      }

      const profile = await container.repositories.staffProfiles.update(req.auth!.userId, updates)
      res.json({ profile })
    } catch (err) {
      next(err)
    }
  })

  router.post('/students/archive', async (req, res, next) => {
    try {
      const parsed = archiveStudentsSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request body' })
        return
      }

      const archived = await container.repositories.students.archiveMany(parsed.data.ids)
      res.json({ archived })
    } catch (err) {
      next(err)
    }
  })

  router.get('/students', async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const pageSize = Number(req.query.pageSize) || 25
      const search = typeof req.query.search === 'string' ? req.query.search : undefined
      const country = typeof req.query.country === 'string' ? req.query.country : undefined
      const leadBand = typeof req.query.leadBand === 'string' ? req.query.leadBand : undefined
      const channel = typeof req.query.channel === 'string' ? req.query.channel : undefined

      let minScore = req.query.minScore ? Number(req.query.minScore) : undefined
      let maxScore = req.query.maxScore ? Number(req.query.maxScore) : undefined

      if (leadBand === 'hot') {
        minScore = 80
        maxScore = undefined
      } else if (leadBand === 'warm') {
        minScore = 60
        maxScore = 79
      } else if (leadBand === 'nurture') {
        minScore = 40
        maxScore = 59
      } else if (leadBand === 'cold') {
        minScore = undefined
        maxScore = 39
      }

      const validChannels = ['facebook', 'lead_bot'] as const
      const channelFilter =
        channel && validChannels.includes(channel as (typeof validChannels)[number])
          ? (channel as (typeof validChannels)[number])
          : 'lead_bot'

      const result = await container.repositories.students.list({
        page,
        pageSize,
        search,
        country,
        channel: channelFilter,
        minScore,
        maxScore,
      })

      const studentIds = result.data.map((s: Student) => s.id)
      const scores =
        studentIds.length > 0
          ? await Promise.all(
              studentIds.map((id: string) =>
                container.repositories.leadScores.findByStudentId(id),
              ),
            )
          : []

      const scoreMap = new Map(
        studentIds.map((id: string, i: number) => [id, scores[i]?.overall_score ?? 0]),
      )

      const latestNotesMap =
        studentIds.length > 0
          ? await container.repositories.studentNotes.findLatestByStudentIds(studentIds)
          : new Map()

      res.json({
        ...result,
        data: result.data.map((s: Student) => ({
          ...s,
          overall_score: scoreMap.get(s.id) ?? 0,
          latest_note: latestNotesMap.get(s.id) ?? null,
        })),
      })
    } catch (err) {
      next(err)
    }
  })

  router.get('/students/export', async (req, res, next) => {
    try {
      const from = typeof req.query.from === 'string' ? req.query.from : undefined
      const to = typeof req.query.to === 'string' ? req.query.to : undefined

      let query = container.db
        .from('students')
        .select('*')
        .is('archived_at', null)
        .eq('channel', 'lead_bot')
        .order('last_activity_at', {
        ascending: false,
      })

      if (from) query = query.gte('last_activity_at', from)
      if (to) query = query.lte('last_activity_at', to)

      const { data: students, error } = await query
      if (error) throw error

      const rows = students ?? []
      const headers = [
        'name',
        'email',
        'phone',
        'country',
        'citizenship',
        'current_education_level',
        'desired_qualification',
        'field_of_study',
        'english_level',
        'preferred_intake',
        'budget',
        'visa_status',
        'funding_source',
        'funds_available',
        'english_test_completed',
        'visa_refusal_history',
        'channel',
        'enrolment_status',
        'ready_to_apply',
        'english_ability',
        'budget_fit',
        'intake_timeframe',
        'visa_readiness',
        'education_match',
        'interest_level',
      ]

      const csvLines = [headers.join(',')]

      for (const student of rows) {
        const score = await container.repositories.leadScores.findByStudentId(student.id)
        const values = [
          student.name,
          student.email,
          student.phone,
          student.country,
          student.citizenship,
          student.current_education_level,
          student.desired_qualification,
          student.field_of_study,
          student.english_level,
          student.preferred_intake,
          student.budget,
          student.visa_status,
          student.funding_source,
          student.funds_available,
          student.english_test_completed,
          student.visa_refusal_history,
          student.channel,
          student.enrolment_status,
          score?.overall_score ?? 0,
          score?.ready_to_apply ?? 0,
          score?.english_ability ?? 0,
          score?.budget_fit ?? 0,
          score?.intake_timeframe ?? 0,
          score?.visa_readiness ?? 0,
          score?.education_match ?? 0,
          score?.interest_level ?? 0,
        ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        csvLines.push(values.join(','))
      }

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"')
      res.send(csvLines.join('\n'))
    } catch (err) {
      next(err)
    }
  })

  router.get('/students/:id', async (req, res, next) => {
    try {
      const student = await container.repositories.students.findById(req.params.id)
      if (!student) {
        res.status(404).json({ error: 'Student not found' })
        return
      }
      const leadScore = await container.repositories.leadScores.findByStudentId(student.id)
      res.json({ student, leadScore })
    } catch (err) {
      next(err)
    }
  })

  router.patch('/students/:id/enrolment-status', async (req, res, next) => {
    try {
      const { status } = req.body as { status?: string }
      if (!status || !ENROLMENT_STATUSES.includes(status as EnrolmentStatus)) {
        res.status(400).json({ error: 'Invalid enrolment status' })
        return
      }
      const student = await container.repositories.students.updateEnrolmentStatus(
        req.params.id,
        status as EnrolmentStatus,
      )
      res.json({ student })
    } catch (err) {
      next(err)
    }
  })

  router.get('/students/:id/messages', async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || 50
      const offset = Number(req.query.offset) || 0
      const messages = await container.repositories.messages.listByStudentId(req.params.id, {
        limit,
        offset,
      })
      res.json({ messages, limit, offset })
    } catch (err) {
      next(err)
    }
  })

  router.get('/students/:id/notes', async (req, res, next) => {
    try {
      const student = await container.repositories.students.findById(req.params.id)
      if (!student) {
        res.status(404).json({ error: 'Student not found' })
        return
      }
      const notes = await container.repositories.studentNotes.listByStudentId(student.id)
      res.json({ notes })
    } catch (err) {
      next(err)
    }
  })

  router.post('/students/:id/notes', async (req, res, next) => {
    try {
      const content = parseNoteContent(req.body)
      if (!content) {
        res.status(400).json({ error: 'Note content is required' })
        return
      }

      const student = await container.repositories.students.findById(req.params.id)
      if (!student) {
        res.status(404).json({ error: 'Student not found' })
        return
      }

      const note = await container.repositories.studentNotes.create({
        student_id: student.id,
        content,
        author_email: req.auth?.email ?? 'unknown',
      })
      res.status(201).json({ note })
    } catch (err) {
      next(err)
    }
  })

  router.patch('/students/:id/notes/:noteId', async (req, res, next) => {
    try {
      const content = parseNoteContent(req.body)
      if (!content) {
        res.status(400).json({ error: 'Note content is required' })
        return
      }

      const note = await container.repositories.studentNotes.findById(req.params.noteId)
      if (!note || note.student_id !== req.params.id) {
        res.status(404).json({ error: 'Note not found' })
        return
      }

      const updated = await container.repositories.studentNotes.update(note.id, content)
      res.json({ note: updated })
    } catch (err) {
      next(err)
    }
  })

  router.delete('/students/:id/notes/:noteId', async (req, res, next) => {
    try {
      const note = await container.repositories.studentNotes.findById(req.params.noteId)
      if (!note || note.student_id !== req.params.id) {
        res.status(404).json({ error: 'Note not found' })
        return
      }

      await container.repositories.studentNotes.delete(note.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  })

  router.get('/pipeline', async (_req, res, next) => {
    try {
      const hot = await container.repositories.leadScores.listByScoreBand(80)
      const warm = await container.repositories.leadScores.listByScoreBand(60, 79)
      const nurture = await container.repositories.leadScores.listByScoreBand(40, 59)
      const cold = await container.repositories.leadScores.listByScoreBand(0, 39)

      const enrich = async (scores: LeadScore[]) => {
        const entries = await Promise.all(
          scores.map(async (score: LeadScore) => {
            const student = await container.repositories.students.findById(score.student_id)
            if (!student) return null
            return {
              studentId: score.student_id,
              name: student.name ?? 'Unknown',
              overallScore: score.overall_score,
              lastActivity: student.last_activity_at,
            }
          }),
        )
        return entries.filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      }

      res.json({
        hot: await enrich(hot),
        warm: await enrich(warm),
        nurture: await enrich(nurture),
        cold: await enrich(cold),
      })
    } catch (err) {
      next(err)
    }
  })

  router.get('/analytics', async (_req, res, next) => {
    try {
      const { count: conversationCount } = await container.db
        .from('conversations')
        .select('id, students!inner(archived_at, channel)', { count: 'exact', head: true })
        .is('students.archived_at', null)
        .eq('students.channel', 'lead_bot')

      const { count: studentCount } = await container.db
        .from('students')
        .select('*', { count: 'exact', head: true })
        .is('archived_at', null)
        .eq('channel', 'lead_bot')

      const { data: studentsWithEmail } = await container.db
        .from('students')
        .select('id')
        .is('archived_at', null)
        .eq('channel', 'lead_bot')
        .not('email', 'is', null)

      const { data: appointed } = await container.db
        .from('students')
        .select('id')
        .is('archived_at', null)
        .eq('channel', 'lead_bot')
        .eq('enrolment_status', 'appointment_booked')

      res.json(
        buildAdminAnalytics({
          conversationCount: conversationCount ?? 0,
          studentCount: studentCount ?? 0,
          leadsWithEmail: studentsWithEmail?.length ?? 0,
          appointedCount: appointed?.length ?? 0,
        }),
      )
    } catch (err) {
      next(err)
    }
  })

  router.get('/chat-insights/summary', async (req, res, next) => {
    try {
      const from = typeof req.query.from === 'string' ? req.query.from : undefined
      const to = typeof req.query.to === 'string' ? req.query.to : undefined
      const range = parseInsightsDateRange(from, to)

      const [counts, totalQuestions] = await Promise.all([
        container.repositories.webchatMessages.countByCategory(range),
        container.repositories.webchatMessages.countUserQuestions(range),
      ])

      const countMap = new Map(counts.map((row) => [row.category, row.count]))
      const categories = CHAT_QUESTION_CATEGORIES.map((entry) => ({
        slug: entry.slug,
        label: entry.label,
        count: countMap.get(entry.slug) ?? 0,
      })).sort((a, b) => b.count - a.count)

      res.json({
        categories,
        totalQuestions,
        dateRange: range,
      })
    } catch (err) {
      next(err)
    }
  })

  router.get('/chat-insights/questions', async (req, res, next) => {
    try {
      const categoryParam = req.query.category
      if (typeof categoryParam !== 'string' || !isChatQuestionCategory(categoryParam)) {
        res.status(400).json({ error: 'Invalid category' })
        return
      }

      const page = Number(req.query.page) || 1
      const from = typeof req.query.from === 'string' ? req.query.from : undefined
      const to = typeof req.query.to === 'string' ? req.query.to : undefined

      const result = await container.repositories.webchatMessages.listByCategory(categoryParam, {
        page,
        pageSize: 25,
        from,
        to,
      })

      res.json({
        data: result.data.map((message) => ({
          id: message.id,
          content: message.content,
          category: message.category,
          createdAt: message.created_at,
        })),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      })
    } catch (err) {
      next(err)
    }
  })

  return router
}
