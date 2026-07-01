import { useEffect, useRef } from 'react'

interface LeadBotMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

interface LeadBotMessageListProps {
  messages: LeadBotMessage[]
  typing?: boolean
  placeholder?: string
}

export function LeadBotMessageList({ messages, typing, placeholder }: LeadBotMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing])

  return (
    <div className="min-h-[12rem] flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
      {messages.length === 0 && placeholder && !typing && (
        <p className="text-sm text-gray-600">{placeholder}</p>
      )}
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
        </div>
      ))}
      {typing && (
        <p className="text-sm text-gray-500" aria-busy="true">
          Typing…
        </p>
      )}
      <div ref={bottomRef} aria-hidden="true" className="h-px shrink-0" />
    </div>
  )
}

export type { LeadBotMessage }
