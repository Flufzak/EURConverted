<script setup lang="ts">
import CurrencyInput from './CurrencyInput.vue'
import ExchangeRateInfo from './ExchangeRateInfo.vue'
import SwapButton from './SwapButton.vue'
import { useCurrencyConverter } from '../composables/useCurrencyConverter'

const {
  currencies,
  sourceAmount,
  sourceCurrency,
  targetAmount,
  targetCurrency,
  rateText,
  updatedText,
  statusText,
  isStatusWarning,
  swapCurrencies,
} = useCurrencyConverter()
</script>

<template>
  <div class="grid gap-0">
    <CurrencyInput
      v-model:amount="sourceAmount"
      v-model:currency="sourceCurrency"
      label="From"
      :currencies="currencies"
    />

    <SwapButton @swap="swapCurrencies" />

    <CurrencyInput
      label="To"
      :amount="targetAmount"
      :currency="targetCurrency"
      :currencies="currencies"
      readonly
      @update:currency="targetCurrency = $event"
    />
  </div>

  <ExchangeRateInfo
    :rate-text="rateText"
    :updated-text="updatedText"
    :status-text="statusText"
    :is-status-warning="isStatusWarning"
  />
</template>
