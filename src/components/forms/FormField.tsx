import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  name: string
  error?: string
  className?: string
}

type InputFieldProps = BaseProps & {
  as?: 'input'
} & InputHTMLAttributes<HTMLInputElement>

type TextareaFieldProps = BaseProps & {
  as: 'textarea'
} & TextareaHTMLAttributes<HTMLTextAreaElement>

type FormFieldProps = InputFieldProps | TextareaFieldProps

const inputClassName =
  'w-full rounded-card border-2 border-accent-primary bg-background-secondary px-4 py-3 font-body text-base text-text-primary outline-none focus:ring-2 focus:ring-accent-lavender'

export function FormField(props: FormFieldProps) {
  const { label, name, error, className = '', as = 'input', ...rest } = props
  const errorId = error ? `${name}-error` : undefined

  return (
    <label className={`grid gap-1.5 text-sm font-semibold text-text-secondary ${className}`}>
      {label}
      {as === 'textarea' ? (
        <textarea
          name={name}
          id={name}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={inputClassName}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          name={name}
          id={name}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={inputClassName}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <span id={errorId} className="text-xs font-normal text-red-700" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}

type ConsentFieldProps = {
  name?: string
  error?: string
  children: ReactNode
}

export function ConsentField({ name = 'consent', error, children }: ConsentFieldProps) {
  const errorId = error ? `${name}-error` : undefined

  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name={name}
          value="yes"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="mt-1"
        />
        <span>{children}</span>
      </label>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
