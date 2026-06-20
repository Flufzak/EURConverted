import type { CachedRate, CachedRateEntry, CurrencyCode } from "../types/currency";

const memoryRates = new Map<string, CachedRate>();
const rateTableCacheKey = "frankfurter-rate-table";
const legacyCacheKeyPrefixes = ["frankfurter-rate-", "last updated-"];

type CachedRateTable = Record<string, CachedRate>;

function getRateCacheKey(base: CurrencyCode, quote: CurrencyCode) {
  return `${base}-${quote}`;
}

function removeLegacyRateCaches() {
  Object.keys(localStorage)
    .filter((key) => legacyCacheKeyPrefixes.some((prefix) => key.startsWith(prefix)))
    .forEach((key) => localStorage.removeItem(key));
}

function readRateTable(): CachedRateTable {
  const cachedTable = localStorage.getItem(rateTableCacheKey);

  if (!cachedTable) {
    return {};
  }

  try {
    return JSON.parse(cachedTable) as CachedRateTable;
  } catch {
    return {};
  }
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

  removeLegacyRateCaches();
  const cachedRate = readRateTable()[cacheKey];

  if (!cachedRate) {
    return null;
  }

  memoryRates.set(cacheKey, cachedRate);

  return cachedRate;
}

export function replaceCachedRates(rates: CachedRateEntry[]) {
  memoryRates.clear();
  removeLegacyRateCaches();

  const rateTable = rates.reduce<CachedRateTable>((table, { base, quote, rate, date }) => {
    const cacheKey = getRateCacheKey(base, quote);
    const cachedRate = { rate, date };

    table[cacheKey] = cachedRate;
    memoryRates.set(cacheKey, cachedRate);

    return table;
  }, {});

  localStorage.setItem(rateTableCacheKey, JSON.stringify(rateTable));
}
