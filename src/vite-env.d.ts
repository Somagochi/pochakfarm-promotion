/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_SHARE_LINK_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
