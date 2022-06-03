import type { Monaco } from "@monaco-editor/loader";
import type * as NSMonaco from "monaco-editor";
import { convertCompilerOptionsFromJson } from "typescript";
import tsConfig from "~/assets/tsconfig.json";

const monaco = ref<Monaco>();

export default async () => {
  if (!monaco.value) {
    const loader = (await import("@monaco-editor/loader")).default;
    loader.config({ "vs/nls": { availableLanguages: { "*": "ja" }}});
    monaco.value = await loader.init();

    const tsCompilerOptions = convertCompilerOptionsFromJson(tsConfig.compilerOptions, "/tsconfig.json").options as NSMonaco.languages.typescript.CompilerOptions;
    monaco.value.languages.typescript.javascriptDefaults.setCompilerOptions(tsCompilerOptions);
    monaco.value.languages.typescript.typescriptDefaults.setCompilerOptions(tsCompilerOptions);
  }
  return monaco.value;
};
