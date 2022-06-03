<template>
  <div class="container">
    <Tabs
      v-model="srcLanguage"
      label="言語"
      :options="{
        'TypeScript': 'typescript',
        'JavaScript': 'javascript',
      }"/>
    <Editor id="tsEditor" :model="tsModel" v-if="srcLanguage === 'typescript'" />
    <Editor id="jsEditor" :model="jsModel" v-else />
    <Tabs
      v-model="transpileMode"
      label="出力形式"
      :options="{
        '整形済み': 'plain',
        '空白･改行削除': 'trim',
        '最小化': 'minify'
      }"/>
    <Editor id="jsViewer" :model="jsViewModel" :constructionOptions="{ readOnly: true }" />
    <div id="jsUrlViewerContainer">
      <p>ブックマーク用URL:</p>
      <Editor
        id="jsUrlViewer"
        :model="jsUrlModel"
        :constructionOptions="{
          readOnly: true,
          minimap: { enabled: false },
          lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0
        }" />
      <a :href="jsUrl"><Button>テスト</Button></a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { minify } from "terser";

const monaco = await useMonaco();

const tsModel = monaco.editor.createModel("(async()=>{\n  // Write code here\n  \n})();\n", "typescript", monaco.Uri.from({ scheme: "file", path: "/code.ts" }));
const jsModel = monaco.editor.createModel("", "javascript", monaco.Uri.from({ scheme: "file", path: "/code.js" }));
const jsViewModel = monaco.editor.createModel("", "javascript", monaco.Uri.from({ scheme: "file", path: "/view.js" }));
const jsUrlModel = monaco.editor.createModel("javascript:", "plain", monaco.Uri.from({ scheme: "file", path: "/view.txt" }));
const tsWorker = await monaco.languages.typescript.getTypeScriptWorker().then(get => get(tsModel.uri));

const transpileMode = ref<"plain" | "trim" | "minify">("plain");
const srcLanguage = ref<"javascript" | "typescript">("typescript");

const jsCode = ref("");
const jsUrl = ref("");

tsModel.onDidChangeContent(async () => {
  jsCode.value = (await tsWorker.getEmitOutput(tsModel.uri.toString())).outputFiles[0].text;
  if (jsModel.getValue() !== tsModel.getValue()) jsModel.setValue(tsModel.getValue());
});

jsModel.onDidChangeContent(() => {
  if (jsModel.getValue() !== tsModel.getValue()) tsModel.setValue(jsModel.getValue());
});

watch([jsCode, transpileMode], async () => {
  const trimmed = (await minify(jsCode.value, { ecma: 2020, compress: false, mangle: false })).code!;
  switch (transpileMode.value) {
    case "plain": {
      jsViewModel.setValue(jsCode.value);
      jsUrl.value = `javascript:${encodeURI(trimmed)}`;
      break;
    }
    case "trim": {
      jsViewModel.setValue(trimmed);
      jsUrl.value = `javascript:${encodeURI(trimmed)}`;
      break;
    }
    case "minify": {
      const { code: mangled } = await minify(jsCode.value, { ecma: 2020, compress: false, mangle: true });
      try {
        const { code: compressed } = await minify(mangled!, {
          ecma: 2020,
          compress: { conditionals: true, hoist_props: true, inline: 3, passes: 3 },
          mangle: false
        });
        jsViewModel.setValue(compressed!);
        jsUrl.value = `javascript:${encodeURI(compressed!)}`;
      } catch (e) {
        jsViewModel.setValue(mangled!);
        jsUrl.value = `javascript:${encodeURI(mangled!)}`;
      }
      break;
    }
  }
  jsUrlModel.setValue(jsUrl.value);
});
</script>

<style lang="scss">
html, body, #__nuxt {
  @apply m-0 w-full h-full;
}
</style>

<style lang="scss" scoped>
.container {
  @apply flex flex-col w-full h-full max-w-full divide-y;

  #tsEditor, #jsEditor {
    @apply flex-grow w-full h-full;
  }
  #jsViewer {
    @apply flex-grow w-full h-full;
  }
  #jsUrlViewerContainer {
    @apply flex flex-row flex-shrink-0 p-4 gap-x-2;
    p, a {
      @apply flex-shrink-0;
    }
  }
  #jsUrlViewer {
    @apply flex-grow h-10;
  }
}
</style>
