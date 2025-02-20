/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  declare const __BUILD_DATE__: string;