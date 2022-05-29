import type { Environment } from "monaco-editor";

declare global {
  interface Window {
    MonacoEnvironment: Environment;
  }
}
