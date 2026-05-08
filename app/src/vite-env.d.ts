/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_OWNER: string;
  readonly VITE_GITHUB_REPO: string;
  readonly VITE_RATE_LIMIT_MAX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
