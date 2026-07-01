import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import {
  dialCodeOptionValue,
  parseDialCodeOptionValue,
} from '@/lib/lead-bot/country-to-dial-code'
import { PHONE_REGIONS, phoneCountriesByRegion } from '@/lib/lead-bot/phone-countries'

interface LeadBotPhoneInputProps {
  dialCodeValue: string
  localNumber: string
  onDialCodeChange: (value: string) => void
  onLocalNumberChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export interface LeadBotPhoneInputHandle {
  focusNumber: () => void
}

const countriesByRegion = phoneCountriesByRegion()

export const LeadBotPhoneInput = forwardRef<LeadBotPhoneInputHandle, LeadBotPhoneInputProps>(
  function LeadBotPhoneInput(
    {
      dialCodeValue,
      localNumber,
      onDialCodeChange,
      onLocalNumberChange,
      onSubmit,
      disabled,
    },
    ref,
  ) {
    const numberRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focusNumber() {
        numberRef.current?.focus({ preventScroll: true })
      },
    }))

    useEffect(() => {
      if (!disabled) {
        numberRef.current?.focus({ preventScroll: true })
      }
    }, [disabled])

    const canSubmit = localNumber.replace(/\D/g, '').length >= 6

    return (
      <form
        className="flex flex-col gap-2 border-t border-gray-200 p-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (canSubmit) onSubmit()
        }}
      >
        <div className="flex gap-2">
          <select
            value={dialCodeValue}
            onChange={(e) => onDialCodeChange(e.target.value)}
            disabled={disabled}
            aria-label="Country calling code"
            className="max-w-[42%] shrink-0 rounded-full border border-gray-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-60 sm:max-w-[45%]"
          >
            {PHONE_REGIONS.map((region) => {
              const countries = countriesByRegion[region]
              if (!countries?.length) return null
              return (
                <optgroup key={region} label={region}>
                  {countries.map((country) => (
                    <option
                      key={country.iso2}
                      value={dialCodeOptionValue(country.dialCode, country.iso2)}
                    >
                      {country.name} ({country.dialCode})
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
          <input
            ref={numberRef}
            type="tel"
            inputMode="tel"
            value={localNumber}
            onChange={(e) => onLocalNumberChange(e.target.value)}
            placeholder="21 123 4567"
            maxLength={20}
            disabled={disabled}
            aria-label="Phone number"
            className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !canSubmit}
          className="w-full rounded-full bg-[var(--accent-primary,#43329D)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-40"
        >
          Send
        </button>
      </form>
    )
  },
)

export { parseDialCodeOptionValue }
