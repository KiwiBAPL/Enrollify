import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export class ResourceLeadSubmitError extends Error {
  constructor(message = 'Unable to submit your details. Please try again.') {
    super(message)
    this.name = 'ResourceLeadSubmitError'
  }
}

type LeadFields = {
  firstName: string
  lastName: string
  email: string
  linkedinUrl?: string
}

type SubmitRpcName =
  | 'submit_visa_checklist_lead'
  | 'submit_cost_planner_lead'
  | 'submit_accommodation_tips_lead'

type ValidateRpcName =
  | 'validate_visa_checklist_access'
  | 'validate_cost_planner_access'
  | 'validate_accommodation_tips_access'

async function submitResourceLead(rpcName: SubmitRpcName, fields: LeadFields): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new ResourceLeadSubmitError()
  }

  const supabase = getSupabase()
  const { data, error } = await supabase.rpc(rpcName, {
    p_first_name: fields.firstName.trim(),
    p_last_name: fields.lastName.trim(),
    p_email: fields.email.trim(),
    p_linkedin_url: fields.linkedinUrl?.trim() || null,
  })

  if (error || !data) {
    throw new ResourceLeadSubmitError()
  }

  return String(data)
}

async function validateResourceAccess(
  rpcName: ValidateRpcName,
  token: string,
): Promise<boolean> {
  if (!isSupabaseConfigured || !token.trim()) {
    return false
  }

  const supabase = getSupabase()
  const { data, error } = await supabase.rpc(rpcName, {
    p_token: token.trim(),
  })

  if (error) {
    return false
  }

  return data === true
}

export function submitVisaChecklistLead(fields: LeadFields): Promise<string> {
  return submitResourceLead('submit_visa_checklist_lead', fields)
}

export function validateVisaChecklistAccess(token: string): Promise<boolean> {
  return validateResourceAccess('validate_visa_checklist_access', token)
}

export function submitCostPlannerLead(fields: LeadFields): Promise<string> {
  return submitResourceLead('submit_cost_planner_lead', fields)
}

export function validateCostPlannerAccess(token: string): Promise<boolean> {
  return validateResourceAccess('validate_cost_planner_access', token)
}

export function submitAccommodationTipsLead(fields: LeadFields): Promise<string> {
  return submitResourceLead('submit_accommodation_tips_lead', fields)
}

export function validateAccommodationTipsAccess(token: string): Promise<boolean> {
  return validateResourceAccess('validate_accommodation_tips_access', token)
}
