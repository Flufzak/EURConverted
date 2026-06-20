<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import CurrencyConverter from './components/CurrencyConverter.vue'
</script>

<template>
  <main class="grid min-h-[calc(100vh-clamp(3rem,10vw,8rem))] place-items-center py-4">
    <article
      class="card relative z-10 mb-0 w-full max-w-[22rem] px-5 pb-7 pt-6 sm:max-w-[24rem]"
      aria-label="Currency converter"
    >
      <AppHeader />
      <CurrencyConverter />
    </article>
  </main>
</template>
