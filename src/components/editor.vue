<template>
  <div ref="editorEl" :id="id" class="monaco-editor"></div>
</template>

<script lang="ts" setup>
import type NSMonaco from "monaco-editor";

interface Props {
  id: string;
  constructionOptions?: NSMonaco.editor.IStandaloneEditorConstructionOptions,
  model?: NSMonaco.editor.ITextModel;
}

const props = defineProps<Props>();

const editorEl = ref<HTMLDivElement>();
const editor = ref<NSMonaco.editor.IStandaloneCodeEditor>();

onMounted(async () => {
  if (!editorEl.value) return;
  const monaco = await useMonaco();
  const _editor = monaco.editor.create(editorEl.value, {
    formatOnType: true,
    automaticLayout: true,
    tabSize: 2,
    ...props.constructionOptions
  });

  if (props.model) _editor.setModel(props.model);
  editor.value = _editor;
});
</script>

<style lang="scss" scoped>

</style>
