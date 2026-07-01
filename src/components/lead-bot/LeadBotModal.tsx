import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  LeadBotApiError,
  createLeadBotSession,
  submitLeadBotStep,
  type LeadBotSessionState,
} from '@/lib/lead-bot/api'
import { defaultPhoneDialCodeValue } from '@/lib/lead-bot/country-to-dial-code'
import { formatPhoneSubmission, validateStepValue } from '@/lib/lead-bot/flow'
import { getOrCreateLeadBotSessionId, markLeadBotCompleted } from '@/lib/lead-bot/session'
import { useLeadBot } from '@/components/lead-bot/LeadBotProvider'
import { LeadBotChoices } from '@/components/lead-bot/LeadBotChoices'
import { LeadBotInput } from '@/components/lead-bot/LeadBotInput'
import {
  LeadBotMessageList,
  type LeadBotMessage,
} from '@/components/lead-bot/LeadBotMessageList'
import {
  LeadBotPhoneInput,
  parseDialCodeOptionValue,
  type LeadBotPhoneInputHandle,
} from '@/components/lead-bot/LeadBotPhoneInput'

const TYPING_DELAY_MS = 550

function notifyLeadBotCompleted(): void {
  markLeadBotCompleted()
  window.dispatchEvent(new Event('enrollify-lead-bot-completed'))
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function LeadBotModal() {
  const { open, closeLeadBot } = useLeadBot()
  const [messages, setMessages] = useState<LeadBotMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionState, setSessionState] = useState<LeadBotSessionState | null>(null)
  const [completed, setCompleted] = useState(false)
  const [residenceCountry, setResidenceCountry] = useState('')
  const [phoneDialCodeValue, setPhoneDialCodeValue] = useState(() => defaultPhoneDialCodeValue(null))
  const [phoneLocalNumber, setPhoneLocalNumber] = useState('')
  const sessionIdRef = useRef('')
  const panelRef = useRef<HTMLDivElement>(null)
  const bootstrappedRef = useRef(false)
  const textInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<LeadBotPhoneInputHandle>(null)

  const resetUi = useCallback(() => {
    setMessages([])
    setInput('')
    setTyping(false)
    setLoading(false)
    setError('')
    setSessionState(null)
    setCompleted(false)
    setResidenceCountry('')
    setPhoneDialCodeValue(defaultPhoneDialCodeValue(null))
    setPhoneLocalNumber('')
    bootstrappedRef.current = false
  }, [])

  const appendAssistantMessages = useCallback(async (texts: string[]) => {
    setTyping(true)
    for (const text of texts) {
      await delay(TYPING_DELAY_MS)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text }])
    }
    setTyping(false)
  }, [])

  const bootstrapSession = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      sessionIdRef.current = getOrCreateLeadBotSessionId()
      const state = await createLeadBotSession(sessionIdRef.current)
      setSessionState(state)
      setCompleted(state.completed)

      if (state.completed) {
        notifyLeadBotCompleted()
        setMessages([
          {
            id: 'completed',
            role: 'assistant',
            text: "You've already completed this consultation form. Our team will be in touch soon!",
          },
        ])
        return
      }

      if (state.prompt) {
        await appendAssistantMessages([state.prompt])
      } else if (!state.completed) {
        setError('Unable to load the next question. Please close and try again.')
      }
    } catch (err) {
      const message =
        err instanceof LeadBotApiError
          ? err.message
          : 'Unable to start the consultation chat. Please try again shortly.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [appendAssistantMessages])

  useEffect(() => {
    if (!open) {
      resetUi()
      return
    }

    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true
      void bootstrapSession()
    }
  }, [open, bootstrapSession, resetUi])

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLeadBot()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, closeLeadBot])

  const handleSubmitValue = useCallback(
    async (value: string) => {
      const stepId = sessionState?.currentStep
      if (!stepId || loading || typing || completed) return

      const trimmed = value.trim()
      const validationError = validateStepValue(stepId, trimmed)
      if (validationError) {
        setError(validationError)
        return
      }

      if (stepId === 'country') {
        setResidenceCountry(trimmed)
        setPhoneDialCodeValue(defaultPhoneDialCodeValue(trimmed))
      }

      setError('')
      setInput('')
      setPhoneLocalNumber('')
      setLoading(true)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed }])

      try {
        const result = await submitLeadBotStep(sessionIdRef.current, stepId, trimmed)

        if (result.assistantMessages.length > 0) {
          await appendAssistantMessages(result.assistantMessages)
        }

        setCompleted(result.completed)
        if (result.completed) {
          notifyLeadBotCompleted()
        }
        setSessionState((prev) =>
          prev
            ? {
                ...prev,
                currentStep: result.currentStep,
                completed: result.completed,
                prompt: result.nextPrompt,
                inputType: result.inputType,
                options: result.options,
              }
            : prev,
        )
      } catch (err) {
        const message =
          err instanceof LeadBotApiError
            ? err.message
            : 'Unable to save your answer. Please try again.'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [sessionState?.currentStep, loading, typing, completed, appendAssistantMessages],
  )

  const handlePhoneSubmit = useCallback(() => {
    const { dialCode } = parseDialCodeOptionValue(phoneDialCodeValue)
    const combined = formatPhoneSubmission(dialCode, phoneLocalNumber)
    void handleSubmitValue(combined)
  }, [phoneDialCodeValue, phoneLocalNumber, handleSubmitValue])

  const currentStep = sessionState?.currentStep
  const showPhoneInput = currentStep === 'phone' && !completed
  const showTextInput =
    sessionState?.inputType === 'text' && !completed && currentStep !== 'phone'
  const showChoices =
    sessionState?.inputType === 'mcq' &&
    !completed &&
    sessionState.options &&
    sessionState.options.length > 0

  useEffect(() => {
    if (!open || loading || typing) return

    if (showTextInput) {
      textInputRef.current?.focus({ preventScroll: true })
    } else if (showPhoneInput) {
      phoneInputRef.current?.focusNumber()
    }
  }, [open, loading, typing, showTextInput, showPhoneInput, currentStep])

  useEffect(() => {
    if (currentStep === 'phone' && residenceCountry) {
      setPhoneDialCodeValue(defaultPhoneDialCodeValue(residenceCountry))
    }
  }, [currentStep, residenceCountry])

  if (!open) return null

  const bootstrapping = open && loading && !sessionState && !completed

  const overlay = (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLeadBot()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Book a free consultation"
        className="flex min-h-[min(32rem,calc(100dvh-1rem))] max-h-[min(40rem,calc(100dvh-1rem))] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border-2 border-[var(--stroke-primary,#111)] bg-white shadow-[4px_4px_0_0_var(--shadow-hard,#111)] sm:rounded-2xl"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-[var(--accent-mint,#AEE3C8)] px-4 py-3">
          <div>
            <p className="font-semibold text-gray-900">Free consultation</p>
            <p className="text-xs text-gray-600">Tell us a little about your study plans</p>
          </div>
          <button
            type="button"
            onClick={closeLeadBot}
            aria-label="Close consultation chat"
            className="rounded-full p-1 text-gray-700 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            ✕
          </button>
        </div>

        <LeadBotMessageList
          messages={messages}
          typing={typing || bootstrapping}
          placeholder={
            bootstrapping
              ? 'Starting your consultation chat…'
              : error && messages.length === 0
                ? error
                : undefined
          }
        />

        {error && messages.length > 0 && (
          <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {showChoices && (
          <LeadBotChoices
            options={sessionState.options!}
            disabled={loading || typing}
            onSelect={(value) => void handleSubmitValue(value)}
          />
        )}

        {showTextInput && (
          <LeadBotInput
            ref={textInputRef}
            value={input}
            onChange={setInput}
            disabled={loading || typing}
            onSubmit={() => void handleSubmitValue(input)}
            placeholder={
              sessionState.currentStep === 'email' ? 'you@example.com' : 'Type your answer…'
            }
          />
        )}

        {showPhoneInput && (
          <LeadBotPhoneInput
            ref={phoneInputRef}
            dialCodeValue={phoneDialCodeValue}
            localNumber={phoneLocalNumber}
            onDialCodeChange={setPhoneDialCodeValue}
            onLocalNumberChange={setPhoneLocalNumber}
            disabled={loading || typing}
            onSubmit={handlePhoneSubmit}
          />
        )}

        {completed && (
          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={closeLeadBot}
              className="w-full rounded-full bg-[var(--accent-primary,#43329D)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
