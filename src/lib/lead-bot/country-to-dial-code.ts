import { PHONE_COUNTRIES } from './phone-countries'

const DEFAULT_DIAL_CODE = '+64'

/** Common aliases for free-text country answers (normalized lowercase key → ISO2). */
const COUNTRY_ALIASES: Record<string, string> = {
  nz: 'NZ',
  'new zealand': 'NZ',
  aotearoa: 'NZ',
  aus: 'AU',
  australia: 'AU',
  india: 'IN',
  ind: 'IN',
  china: 'CN',
  prc: 'CN',
  philippines: 'PH',
  ph: 'PH',
  filipino: 'PH',
  nepal: 'NP',
  pakistan: 'PK',
  bangladesh: 'BD',
  'sri lanka': 'LK',
  vietnam: 'VN',
  thailand: 'TH',
  indonesia: 'ID',
  malaysia: 'MY',
  singapore: 'SG',
  japan: 'JP',
  'south korea': 'KR',
  korea: 'KR',
  'united kingdom': 'GB',
  uk: 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  usa: 'US',
  us: 'US',
  'united states': 'US',
  america: 'US',
  canada: 'CA',
  fiji: 'FJ',
  samoa: 'WS',
  tonga: 'TO',
  'south africa': 'ZA',
  nigeria: 'NG',
  kenya: 'KE',
  uae: 'AE',
  'united arab emirates': 'AE',
  'saudi arabia': 'SA',
  iran: 'IR',
  iraq: 'IQ',
  brazil: 'BR',
  mexico: 'MX',
  france: 'FR',
  germany: 'DE',
  italy: 'IT',
  spain: 'ES',
  russia: 'RU',
  ukraine: 'UA',
  poland: 'PL',
  netherlands: 'NL',
  ireland: 'IE',
  'hong kong': 'HK',
  taiwan: 'TW',
}

function normalizeCountryInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, ' ')
}

const isoToDialCode = new Map(PHONE_COUNTRIES.map((c) => [c.iso2, c.dialCode]))

/**
 * Map a free-text residence country (from the lead bot) to a default dial code.
 * Falls back to +64 (New Zealand) when no match is found.
 */
export function dialCodeForResidenceCountry(country: string | null | undefined): string {
  return resolveResidenceCountry(country)?.dialCode ?? DEFAULT_DIAL_CODE
}

/**
 * Map a free-text residence country to the best matching phone country entry.
 */
export function resolveResidenceCountry(
  country: string | null | undefined,
): { iso2: string; dialCode: string } | null {
  if (!country?.trim()) return null

  const normalized = normalizeCountryInput(country)

  const aliasIso = COUNTRY_ALIASES[normalized]
  if (aliasIso) {
    const dialCode = isoToDialCode.get(aliasIso)
    if (dialCode) return { iso2: aliasIso, dialCode }
  }

  const byName = PHONE_COUNTRIES.find((c) => c.name.toLowerCase() === normalized)
  if (byName) return { iso2: byName.iso2, dialCode: byName.dialCode }

  const partial = PHONE_COUNTRIES.find(
    (c) =>
      c.name.toLowerCase().includes(normalized) ||
      normalized.includes(c.name.toLowerCase()),
  )
  if (partial) return { iso2: partial.iso2, dialCode: partial.dialCode }

  return null
}

export function defaultPhoneDialCodeValue(country: string | null | undefined): string {
  const resolved = resolveResidenceCountry(country)
  if (resolved) return dialCodeOptionValue(resolved.dialCode, resolved.iso2)
  return dialCodeOptionValue(DEFAULT_DIAL_CODE, 'NZ')
}

export function dialCodeOptionValue(dialCode: string, iso2: string): string {
  return `${dialCode}|${iso2}`
}

export function parseDialCodeOptionValue(value: string): { dialCode: string; iso2: string } {
  const [dialCode, iso2] = value.split('|')
  return { dialCode: dialCode ?? DEFAULT_DIAL_CODE, iso2: iso2 ?? 'NZ' }
}
