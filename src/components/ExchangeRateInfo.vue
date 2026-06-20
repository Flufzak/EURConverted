<script setup lang="ts">
import StatusBadge from "./StatusBadge.vue";

const { rateText, updatedText, statusText, isStatusWarning } = defineProps<{
  rateText: string;
  updatedText: string;
  statusText: string;
  isStatusWarning: boolean;
}>();
</script>

<template>
  <div
    class="mt-5 grid justify-items-center gap-2 pb-1"
    aria-label="Exchange rate status"
  >
    <StatusBadge tone="primary">{{ rateText }}</StatusBadge>
    <div class="flex flex-wrap justify-center gap-2">
      <StatusBadge tone="primary">{{ updatedText }}</StatusBadge>
      <StatusBadge :tone="isStatusWarning ? 'warning' : 'success'">
        {{ statusText }}
      </StatusBadge>
    </div>
  </div>
</template>
