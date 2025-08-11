/// <reference types="vite/client" />

export {};


declare global {

  // const __BUILD_DATE__: string;

  interface Window {
    showGlobalToast?: (message: string, onClick?: () => void) => void;
  }
}



interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string
    readonly VITE_SW_DEV?: string;  // Add any other env vars you use here

  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  