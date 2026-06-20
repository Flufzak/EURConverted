import { computed, ref, watch } from "vue";
import { currencies } from "../data/currencies";
import { fetchRate } from "../services/frankfurterApi";
import { readCachedRate, writeCachedRate } from "../services/rateCache";
import type { CachedRate, CurrencyCode } from "../types/currency";

const amountFormatter = new Intl.NumberFormat("nl-BE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

let rateRequestId = 0;

function formatRateDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function formatAmount(amount: number): string {
  return amountFormatter.format(amount);
}

function parseAmount(amount: string): number {
  const normalizedAmount = amount.includes(",")
    ? amount.replaceAll(".", "").replace(",", ".")
    : amount;
  const parsedValue = Number.parseFloat(normalizedAmount);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
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

    const convertedValue = numericSourceAmount.value * activeRate.value.rate;

    return formatAmount(convertedValue);
  });

  const rateText = computed<string>(() => {
    if (!activeRate.value) {
      return "Rate unavailable";
    }

    return `1,00 ${sourceCurrency.value} = ${formatAmount(activeRate.value.rate)} ${targetCurrency.value}`;
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

  async function loadRate() {
    rateError.value = null;
    const requestId = ++rateRequestId;
    const storedRate = readCachedRate(
      sourceCurrency.value,
      targetCurrency.value,
    );

    if (storedRate) {
      activeRate.value = storedRate;
      isUsingStoredRate.value = false;
      return;
    }

    isRateLoading.value = true;

    try {
      const rate = await fetchRate(sourceCurrency.value, targetCurrency.value);

      if (requestId !== rateRequestId) {
        return;
      }

      activeRate.value = rate;
      isUsingStoredRate.value = false;
      writeCachedRate(sourceCurrency.value, targetCurrency.value, rate);
    } catch {
      if (requestId !== rateRequestId) {
        return;
      }

      rateError.value = "Could not load exchange rate";
    } finally {
      if (requestId === rateRequestId) {
        isRateLoading.value = false;
      }
    }
  }

  function swapCurrencies() {
    const nextSource = targetCurrency.value;
    targetCurrency.value = sourceCurrency.value;
    sourceCurrency.value = nextSource;
  }

  watch([sourceCurrency, targetCurrency], loadRate, { immediate: true });

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
