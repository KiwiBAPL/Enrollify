/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_ANALYTICS_PROVIDER?: 'plausible' | 'ga4'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
