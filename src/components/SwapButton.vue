<script setup lang="ts">
import { computed, ref } from 'vue'
import PrimeButton from 'primevue/button'

const emit = defineEmits<{
  swap: []
}>()

const rotationTurns = ref<number>(0)

const rotationStyle = computed(() => ({
  transform: `rotate(${rotationTurns.value * 180}deg)`,
}))

function handleSwap() {
  rotationTurns.value += 1
  emit('swap')
}
</script>

<template>
  <PrimeButton
    class="swap-button"
    :style="rotationStyle"
    type="button"
    icon="pi pi-arrow-right-arrow-left"
    aria-label="Swap currencies"
    @click="handleSwap"
  />
</template>
