import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface LeadBotContextValue {
  open: boolean
  openLeadBot: () => void
  closeLeadBot: () => void
}

const LeadBotContext = createContext<LeadBotContextValue | null>(null)

export function LeadBotProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openLeadBot = useCallback(() => setOpen(true), [])
  const closeLeadBot = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, openLeadBot, closeLeadBot }),
    [open, openLeadBot, closeLeadBot],
  )

  return <LeadBotContext.Provider value={value}>{children}</LeadBotContext.Provider>
}

export function useLeadBot(): LeadBotContextValue {
  const ctx = useContext(LeadBotContext)
  if (!ctx) {
    throw new Error('useLeadBot must be used within LeadBotProvider')
  }
  return ctx
}
