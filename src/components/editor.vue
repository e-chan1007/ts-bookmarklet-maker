<template>
  <div ref="editorEl" class="editor"></div>
  <div ref="editorEl2" class="editor"></div>
</template>

<script lang="ts" setup>
import type * as monaco from "monaco-editor";
import { convertCompilerOptionsFromJson } from "typescript";
import tsConfig from "~/assets/tsconfig.json";

const editorEl = ref<HTMLDivElement>();
const editorEl2 = ref<HTMLDivElement>();

onMounted(async () => {
  const loader = (await import("@monaco-editor/loader")).default;
  loader.config({ "vs/nls": { availableLanguages: { "*": "ja" }}});
  const monaco = await loader.init();
  console.log("loaded");
  const editor = monaco.editor.create(editorEl.value!);
  const model = monaco.editor.createModel(
    ``,
    "typescript",
    monaco.Uri.from({
      scheme: "file",
      path: "/code.ts"
    })
  );
  editor.setModel(model);
  const tsCompilerOptions = convertCompilerOptionsFromJson(tsConfig.compilerOptions, "/tsconfig.json").options as monaco.languages.typescript.CompilerOptions;
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(tsCompilerOptions);

  const worker = await monaco.languages.typescript.getTypeScriptWorker();
  const proxy = await worker(model.uri);

  const editor2 = monaco.editor.create(editorEl2.value!);
  const model2 = monaco.editor.createModel(
    ``,
    "javascript",
    monaco.Uri.from({
      scheme: "file",
      path: "/let.js"
    })
  );
  editor2.setModel(model2);
  model.onDidChangeContent(async e => {
    const output = await proxy.getEmitOutput(model.uri.toString());
    model2.setValue(output.outputFiles[0].text);
  });
});
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 50%;
}
</style>
