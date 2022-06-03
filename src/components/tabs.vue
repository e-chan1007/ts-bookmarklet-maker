<template>
  <RadioGroup v-model="value" :class="$style['radio-group']">
    <RadioGroupLabel :class="$style['radio-label']">{{ label }}</RadioGroupLabel>
    <div :class="$style['radio-options']">
      <RadioGroupOption v-for="(value, label) in options" :key="value" :value="value">
        <span :class="$style['radio-option']">{{ label }}</span>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>

<script lang="ts" setup>
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption
} from "@headlessui/vue";

interface Props<T = string> {
  modelValue: Props["options"][keyof Props["options"]];
  label: string;
  options: Record<string, T>;
}
interface Emits {
  (event: "update:modelValue", value: Props["modelValue"]): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const value = ref<Props["modelValue"]>(props.modelValue);
watch(value, () => emit("update:modelValue", value.value));
watch(props, () => { value.value = props.modelValue; });
</script>

<style lang="scss" module>
.radio-group {
  @apply flex flex-row items-center px-4 py-2;
}

.radio-label {
  @apply p-2;
}

[aria-checked="true"] > .radio-option {
  @apply bg-blue-100 font-bold;
}

.radio-options {
  @apply flex flex-row divide-x divide-blue-300 border border-blue-300 rounded;
}

.radio-option {
  @apply block px-4 py-1 text-center cursor-pointer;
}

</style>
