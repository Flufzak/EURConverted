<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CurrencyCode, CurrencyOption } from '../types/currency'

const { modelValue, currencies } = defineProps<{
  modelValue: CurrencyCode
  currencies: CurrencyOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CurrencyCode]
}>()

const isOpen = ref<boolean>(false)
const selectorRef = ref<HTMLElement | null>(null)

const selectedCurrency = computed(() => {
  return currencies.find((currency) => currency.code === modelValue) ?? currencies[0]
})

function chooseCurrency(currency: CurrencyOption) {
  emit('update:modelValue', currency.code)
  isOpen.value = false
}

function closeOnOutsideClick(event: MouseEvent) {
  if (!selectorRef.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeOnOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeOnOutsideClick)
})
</script>

<template>
  <div ref="selectorRef" class="relative z-50">
    <button
      class="currency-selector-trigger"
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click.stop="isOpen = !isOpen"
    >
      <p class="currency-symbol">
        {{ selectedCurrency?.symbol }}
      </p>
      <div class="currency-selector-copy">
        <strong class="currency-selector-code">{{ selectedCurrency?.code }}</strong>
        <small class="currency-selector-name">{{ selectedCurrency?.name }}</small>
      </div>
      <p class="pi pi-chevron-down currency-selector-chevron" aria-hidden="true"></p>
    </button>

    <div
      v-if="isOpen"
      class="currency-selector-menu"
      role="listbox"
    >
      <button
        v-for="currency in currencies"
        :key="currency.code"
        class="currency-selector-option"
        :class="{ selected: currency.code === modelValue }"
        type="button"
        role="option"
        :aria-selected="currency.code === modelValue"
        @click="chooseCurrency(currency)"
      >
        <p class="currency-symbol">
          {{ currency.symbol }}
        </p>
        <div class="currency-selector-copy">
          <strong class="currency-selector-code">{{ currency.code }}</strong>
          <small class="currency-selector-name">{{ currency.name }}</small>
        </div>
      </button>
    </div>
  </div>
</template>
