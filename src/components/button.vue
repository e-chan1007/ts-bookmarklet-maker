<template>
  <button><slot /></button>
</template>

<style lang="scss" scoped>
button {
  @apply flex flex-row border border-blue-300 rounded block px-4 py-1 text-center cursor-pointer hover:bg-blue-100;
}
</style>
