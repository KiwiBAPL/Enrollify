import { Router } from 'express'
import type { Container } from '../../container.js'
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

export function createAdminRouter(container: Container): Router {
  const router = Router()
  const auth = createAuthMiddleware(container.db)

  router.use(auth)

  router.use('/ai-providers', createAIProvidersRouter(container))

  router.get('/students', async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const pageSize = Number(req.query.pageSize) || 25
      const search = typeof req.query.search === 'string' ? req.query.search : undefined
      const country = typeof req.query.country === 'string' ? req.query.country : undefined
      const leadBand = typeof req.query.leadBand === 'string' ? req.query.leadBand : undefined

      let minScore = req.query.minScore ? Number(req.query.minScore) : undefined
      let maxScore = req.query.maxScore ? Number(req.query.maxScore) : undefined

      if (leadBand === 'hot') {
        minScore = 70
        maxScore = undefined
      } else if (leadBand === 'warm') {
        minScore = 40
        maxScore = 69
      } else if (leadBand === 'cold') {
        minScore = undefined
        maxScore = 39
      }

      const result = await container.repositories.students.list({
        page,
        pageSize,
        search,
        country,
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

      res.json({
        ...result,
        data: result.data.map((s: Student) => ({
          ...s,
          overall_score: scoreMap.get(s.id) ?? 0,
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

      let query = container.db.from('students').select('*').order('last_activity_at', {
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
        'enrolment_status',
        'overall_score',
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

  router.get('/pipeline', async (_req, res, next) => {
    try {
      const hot = await container.repositories.leadScores.listByScoreBand(70)
      const warm = await container.repositories.leadScores.listByScoreBand(40, 69)
      const cold = await container.repositories.leadScores.listByScoreBand(0, 39)

      const enrich = async (scores: LeadScore[]) => {
        return Promise.all(
          scores.map(async (score: LeadScore) => {
            const student = await container.repositories.students.findById(score.student_id)
            return {
              studentId: score.student_id,
              name: student?.name ?? 'Unknown',
              overallScore: score.overall_score,
              lastActivity: student?.last_activity_at,
            }
          }),
        )
      }

      res.json({
        hot: await enrich(hot),
        warm: await enrich(warm),
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
        .select('*', { count: 'exact', head: true })

      const { count: studentCount } = await container.db
        .from('students')
        .select('*', { count: 'exact', head: true })

      const { data: studentsWithEmail } = await container.db
        .from('students')
        .select('id')
        .not('email', 'is', null)

      const { data: appointed } = await container.db
        .from('students')
        .select('id')
        .eq('enrolment_status', 'appointment_booked')

      const totalConversations = conversationCount ?? 0
      const totalStudents = studentCount ?? 0
      const leadsWithEmail = studentsWithEmail?.length ?? 0

      const leadCaptureRate =
        totalStudents > 0 ? Math.round((leadsWithEmail / totalStudents) * 100) : null

      const conversionRate =
        totalStudents > 0 ? Math.round(((appointed?.length ?? 0) / totalStudents) * 100) : null

      res.json({
        totalConversations: totalConversations || '—',
        averageFirstResponseTimeSeconds: '—',
        leadCaptureRate: leadCaptureRate !== null ? `${leadCaptureRate}%` : '—',
        conversionRate: conversionRate !== null ? `${conversionRate}%` : '—',
      })
    } catch (err) {
      next(err)
    }
  })

  return router
}
