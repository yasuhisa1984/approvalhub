/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASIC_AUTH_ENABLED?: string
  readonly VITE_BASIC_AUTH_PASSWORD?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
