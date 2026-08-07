/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_GIT_SHA: string
  readonly VITE_API_URL?: string
  readonly VITE_SCHOOL_SLUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
