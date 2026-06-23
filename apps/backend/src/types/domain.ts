export type ChannelType = 'facebook' | 'webchat'
export type MessageType = 'user' | 'assistant'
export type EnrolmentStatus =
  | 'enquiry'
  | 'qualified_lead'
  | 'appointment_booked'
  | 'application_submitted'
  | 'enrolled'
  | 'not_qualified'

export interface Student {
  id: string
  channel: ChannelType
  channel_user_id: string
  name: string | null
  email: string | null
  phone: string | null
  country: string | null
  citizenship: string | null
  current_education_level: string | null
  desired_qualification: string | null
  field_of_study: string | null
  english_level: string | null
  preferred_intake: string | null
  budget: string | null
  visa_status: string | null
  enrolment_status: EnrolmentStatus
  last_activity_at: string | null
  created_at: string
  updated_at: string
}

export type StudentInsert = Pick<Student, 'channel' | 'channel_user_id'> &
  Partial<Omit<Student, 'id' | 'channel' | 'channel_user_id' | 'created_at' | 'updated_at'>>

export type StudentUpdate = Partial<
  Omit<Student, 'id' | 'channel' | 'channel_user_id' | 'created_at' | 'updated_at'>
>

export interface Conversation {
  id: string
  student_id: string
  channel: ChannelType
  status: string
  started_at: string
  last_message_at: string | null
  created_at: string
  updated_at: string
}

export type ConversationInsert = Pick<Conversation, 'student_id' | 'channel'> &
  Partial<Pick<Conversation, 'status' | 'started_at' | 'last_message_at'>>

export interface Message {
  id: string
  conversation_id: string
  message_type: MessageType
  content: string
  created_at: string
}

export type MessageInsert = Pick<Message, 'conversation_id' | 'message_type' | 'content'> &
  Partial<Pick<Message, 'created_at'>>

export interface LeadScore {
  id: string
  student_id: string
  overall_score: number
  ready_to_apply: number
  english_ability: number
  budget_fit: number
  intake_timeframe: number
  visa_readiness: number
  education_match: number
  interest_level: number
  created_at: string
  updated_at: string
}

export interface LeadScoreFactors {
  ready_to_apply: number
  english_ability: number
  budget_fit: number
  intake_timeframe: number
  visa_readiness: number
  education_match: number
  interest_level: number
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string | null
  source_document_url: string | null
  created_at: string
  updated_at: string
}

export interface StudentListFilters {
  search?: string
  country?: string
  minScore?: number
  maxScore?: number
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
