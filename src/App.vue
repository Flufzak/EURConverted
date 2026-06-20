<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import CurrencyConverter from './components/CurrencyConverter.vue'
</script>

<template>
  <main class="mb-0 grid min-h-[calc(100dvh-clamp(2rem,8vw,4rem))] place-items-center py-2">
    <article
      class="card relative z-10 mb-0 w-full max-w-[22rem] px-5 pb-7 pt-6 sm:max-w-[24rem]"
      aria-label="Currency converter"
    >
      <AppHeader />
      <CurrencyConverter />
    </article>
  </main>
</template>
