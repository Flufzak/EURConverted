import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { currencies, refreshRatePairs } from "../data/currencies";
import { fetchRateTable } from "../services/frankfurterApi";
import {
  hydrateCachedRates,
  readCachedRate,
  replaceCachedRates,
} from "../services/rateCache";
import type { CachedRate, CurrencyCode } from "../types/currency";

const amountFormatter = new Intl.NumberFormat("nl-BE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const preciseRateFormatter = new Intl.NumberFormat("nl-BE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

let refreshRequestId = 0;

function formatRateDate(date: string): string {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function formatAmount(amount: number): string {
  return amountFormatter.format(amount);
}

function formatRate(rate: number): string {
  if (rate !== 0 && Math.abs(rate) < 0.01) {
    return preciseRateFormatter.format(rate);
  }

  return formatAmount(rate);
}

function parseAmount(amount: string): number {
  const normalizedAmount = amount.includes(",")
    ? amount.replaceAll(".", "").replace(",", ".")
    : amount;
  const parsedValue = Number.parseFloat(normalizedAmount);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function getIdentityRate(): CachedRate {
  return {
    rate: 1,
    date: new Date().toISOString().slice(0, 10),
  };
}

function isBrowserOnline(): boolean {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

export function useCurrencyConverter() {
  const sourceAmount = ref<string>("1,00");
  const sourceCurrency = ref<CurrencyCode>("EUR");
  const targetCurrency = ref<CurrencyCode>("AMD");
  const activeRate = ref<CachedRate | null>(null);
  const isRateLoading = ref<boolean>(false);
  const isUsingStoredRate = ref<boolean>(false);
  const rateError = ref<string | null>(null);

  const numericSourceAmount = computed<number>(() => {
    return parseAmount(sourceAmount.value);
  });

  const targetAmount = computed<string>(() => {
    if (!activeRate.value) {
      return "...";
    }

    return formatAmount(numericSourceAmount.value * activeRate.value.rate);
  });

  const rateText = computed<string>(() => {
    if (!activeRate.value) {
      return "Rate unavailable";
    }

    return `1,00 ${sourceCurrency.value} = ${formatRate(activeRate.value.rate)} ${targetCurrency.value}`;
  });

  const updatedText = computed<string>(() => {
    if (isRateLoading.value) {
      return "Updating rate";
    }

    if (!activeRate.value) {
      return "No stored rate";
    }

    return `Last updated at ${formatRateDate(activeRate.value.date)}`;
  });

  const isStatusWarning = computed<boolean>(
    () => isUsingStoredRate.value || Boolean(rateError.value),
  );

  const statusText = computed<string>(() =>
    isStatusWarning.value ? "Offline" : "Online",
  );

  function setActiveRateFromCache(isStoredFallback: boolean) {
    if (sourceCurrency.value === targetCurrency.value) {
      activeRate.value = getIdentityRate();
      isUsingStoredRate.value = false;
      return;
    }

    const storedRate = readCachedRate(
      sourceCurrency.value,
      targetCurrency.value,
    );

    activeRate.value = storedRate;
    isUsingStoredRate.value = Boolean(storedRate) && isStoredFallback;
  }

  async function refreshRates() {
    if (!isBrowserOnline()) {
      rateError.value = "Could not load exchange rate";
      setActiveRateFromCache(true);
      return;
    }

    const requestId = ++refreshRequestId;
    isRateLoading.value = true;
    rateError.value = null;

    try {
      const rates = await fetchRateTable(refreshRatePairs);

      if (requestId !== refreshRequestId) {
        return;
      }

      await replaceCachedRates(rates);
      setActiveRateFromCache(false);
    } catch {
      if (requestId !== refreshRequestId) {
        return;
      }

      rateError.value = "Could not load exchange rate";
      setActiveRateFromCache(true);
    } finally {
      if (requestId === refreshRequestId) {
        isRateLoading.value = false;
      }
    }
  }

  function swapCurrencies() {
    const nextSource = targetCurrency.value;
    targetCurrency.value = sourceCurrency.value;
    sourceCurrency.value = nextSource;
  }

  function handleOnline() {
    refreshRates();
  }

  function handleOffline() {
    rateError.value = "Could not load exchange rate";
    setActiveRateFromCache(true);
  }

  async function initializeRates() {
    await hydrateCachedRates();
    setActiveRateFromCache(!isBrowserOnline() || Boolean(rateError.value));
    await refreshRates();
  }

  watch(
    [sourceCurrency, targetCurrency],
    () =>
      setActiveRateFromCache(!isBrowserOnline() || Boolean(rateError.value)),
    { immediate: true },
  );

  onMounted(() => {
    initializeRates();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  });

  return {
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
  };
}
