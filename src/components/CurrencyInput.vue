<script setup lang="ts">
import { ref } from "vue";
import CurrencySelector from "./CurrencySelector.vue";
import type { CurrencyCode, CurrencyOption } from "../types/currency";

const {
  label,
  amount,
  currency,
  currencies,
  readonly = false,
} = defineProps<{
  label: string;
  amount: string;
  currency: CurrencyCode;
  currencies: CurrencyOption[];
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:amount": [value: string];
  "update:currency": [value: CurrencyCode];
}>();

const amountInput = ref<HTMLInputElement | null>(null);

function clearAmount() {
  if (!readonly && amount) {
    emit("update:amount", "");
    amountInput.value?.focus();
  }
}
</script>

<template>
  <div class="surface mb-0 grid gap-2.5 p-3" :aria-label="label">
    <div
      class="flex items-center justify-between text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-muted)]"
    >
      <p class="m-0">{{ label }}</p>
    </div>

    <CurrencySelector
      :model-value="currency"
      :currencies="currencies"
      @update:model-value="emit('update:currency', $event)"
    />

    <label class="relative m-0 block">
      <p class="sr-only">{{ label }} amount</p>
      <input
        ref="amountInput"
        class="min-h-12 bg-[var(--color-surface)] py-2 pl-4 pr-12 text-2xl font-extrabold leading-none text-[var(--color-primary-dark)] read-only:text-[var(--color-text)]"
        autocomplete="off"
        enterkeyhint="done"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        type="text"
        :readonly="readonly"
        :value="amount"
        placeholder="0,00"
        @input="
          emit('update:amount', ($event.target as HTMLInputElement).value)
        "
      />
      <button
        v-if="!readonly && amount"
        class="amount-clear-button"
        type="button"
        aria-label="Clear amount"
        @pointerdown.prevent
        @click="clearAmount"
      >
        <i class="pi pi-times text-sm" aria-hidden="true"></i>
      </button>
    </label>
  </div>
</template>
