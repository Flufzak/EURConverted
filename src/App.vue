<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import CurrencyConverter from './components/CurrencyConverter.vue'
</script>

<template>
  <main class="app-shell">
    <article
      class="card converter-card relative z-10 w-full max-w-[22rem] px-5 pb-7 pt-6 sm:max-w-[24rem]"
      aria-label="Currency converter"
    >
      <AppHeader />
      <CurrencyConverter />
    </article>
  </main>
</template>
