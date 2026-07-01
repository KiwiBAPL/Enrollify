import { useCallback, useEffect, useRef, useState } from 'react'
import { useLeadBot } from '@/components/lead-bot/LeadBotProvider'
import {
  ChatConsultationCta,
  WELCOME_CONSULTATION_INVITE,
} from '@/components/chat/ChatConsultationCta'
import { ChatApiError, sendChatMessage } from '@/lib/chat/api'
import { getOrCreateSessionId } from '@/lib/chat/session'
import { isLeadBotCompleted } from '@/lib/lead-bot/session'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  consultationInvite?: string | null
}

const WELCOME =
  "Hi! I'm Enrollify AI. Ask me about studying in New Zealand — courses, visas, costs, and next steps."

function isChatEnabled(): boolean {
  const flag = import.meta.env.VITE_CHAT_ENABLED
  return flag !== 'false'
}

export function ChatWidget() {
  const { openLeadBot } = useLeadBot()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [welcomed, setWelcomed] = useState(false)
  const [leadBotCompleted, setLeadBotCompleted] = useState(() => isLeadBotCompleted())
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionIdRef = useRef<string>('')

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId()
  }, [])

  useEffect(() => {
    function syncCompleted() {
      setLeadBotCompleted(isLeadBotCompleted())
    }

    syncCompleted()
    window.addEventListener('storage', syncCompleted)
    window.addEventListener('enrollify-lead-bot-completed', syncCompleted)
    return () => {
      window.removeEventListener('storage', syncCompleted)
      window.removeEventListener('enrollify-lead-bot-completed', syncCompleted)
    }
  }, [])

  useEffect(() => {
    if (open && !welcomed) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: WELCOME,
          consultationInvite: leadBotCompleted ? null : WELCOME_CONSULTATION_INVITE,
        },
      ])
      setWelcomed(true)
    }
  }, [open, welcomed, leadBotCompleted])

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    inputRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const handleBookConsultation = useCallback(() => {
    setOpen(false)
    openLeadBot()
  }, [openLeadBot])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError('')
    setLoading(true)
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text }])

    try {
      const completed = isLeadBotCompleted()
      const { reply, consultationInvite } = await sendChatMessage(sessionIdRef.current, text, {
        leadBotCompleted: completed,
      })
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: reply,
          consultationInvite: completed ? null : consultationInvite,
        },
      ])
    } catch (err) {
      const message =
        err instanceof ChatApiError
          ? err.message
          : 'Unable to reach the assistant. Please try again shortly.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  if (!isChatEnabled()) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Enrollify AI"
          className="flex max-h-[min(32rem,calc(100dvh-6rem))] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border-2 border-[var(--stroke-primary,#111)] bg-white shadow-[4px_4px_0_0_var(--shadow-hard,#111)]"
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-[var(--accent-mint,#AEE3C8)] px-4 py-3">
            <div>
              <p className="font-semibold text-gray-900">Enrollify AI</p>
              <p className="text-xs text-gray-600">Study in New Zealand</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-gray-700 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[var(--accent-primary,#43329D)] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'assistant' && m.consultationInvite && !leadBotCompleted && (
                  <ChatConsultationCta
                    invite={m.consultationInvite}
                    onBookConsultation={handleBookConsultation}
                  />
                )}
              </div>
            ))}
            {loading && (
              <p className="text-sm text-gray-500" aria-busy="true">
                Typing…
              </p>
            )}
          </div>

          {error && (
            <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <form
            className="flex gap-2 border-t border-gray-200 p-3"
            onSubmit={(e) => {
              e.preventDefault()
              void handleSend()
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={2000}
              disabled={loading}
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-[var(--accent-primary,#43329D)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat with Enrollify AI'}
        aria-expanded={open}
        className="rounded-full border-2 border-[var(--stroke-primary,#111)] bg-[var(--accent-primary,#43329D)] px-5 py-3 text-sm font-semibold text-white shadow-[3px_3px_0_0_var(--shadow-hard,#111)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
      >
        {open ? 'Close chat' : 'Chat with us'}
      </button>
    </div>
  )
}
