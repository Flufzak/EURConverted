<script setup lang="ts">
import { computed } from 'vue'

const { tone = 'primary' } = defineProps<{
  tone?: 'primary' | 'success' | 'warning'
}>()

const toneClass = computed(() => {
  if (tone === 'success') {
    return 'success'
  }

  if (tone === 'warning') {
    return 'warning'
  }

  return 'bg-[var(--color-surface-soft)] text-[var(--color-primary-dark)]'
})
</script>

<template>
  <p
    class="m-0 inline-flex min-h-8 items-center justify-center rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-extrabold"
    :class="toneClass"
  >
    <slot />
  </p>
</template>
