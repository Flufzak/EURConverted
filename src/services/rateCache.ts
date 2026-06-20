import type { CachedRate, CurrencyCode } from "../types/currency";

const memoryRates = new Map<string, CachedRate>();

function getRateCacheKey(base: CurrencyCode, quote: CurrencyCode) {
  return `frankfurter-rate-${base}-${quote}`;
}

export function readCachedRate(
  base: CurrencyCode,
  quote: CurrencyCode,
): CachedRate | null {
  const cacheKey = getRateCacheKey(base, quote);
  const memoryRate = memoryRates.get(cacheKey);

  if (memoryRate) {
    return memoryRate;
  }

  const cachedRate = localStorage.getItem(cacheKey);

  if (!cachedRate) {
    return null;
  }

  try {
    const parsedRate = JSON.parse(cachedRate) as CachedRate;
    memoryRates.set(cacheKey, parsedRate);

    return parsedRate;
  } catch {
    return null;
  }
}

export function writeCachedRate(
  base: CurrencyCode,
  quote: CurrencyCode,
  rate: CachedRate,
) {
  const cacheKey = getRateCacheKey(base, quote);

  memoryRates.set(cacheKey, rate);
  localStorage.setItem(cacheKey, JSON.stringify(rate));
}
