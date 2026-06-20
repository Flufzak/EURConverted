<script setup lang="ts">
import PrimeButton from 'primevue/button'

defineEmits<{
  swap: []
}>()
</script>

<template>
  <PrimeButton
    class="swap-button"
    type="button"
    icon="pi pi-arrow-right-arrow-left"
    aria-label="Swap currencies"
    @click="$emit('swap')"
  />
</template>
