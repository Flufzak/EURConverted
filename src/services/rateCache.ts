import type { CachedRate, CachedRateEntry, CurrencyCode } from "../types/currency";

const memoryRates = new Map<string, CachedRate>();
const rateTableCacheKey = "frankfurter-rate-table";
const persistentCacheName = "eurconverted-rate-table-v1";
const persistentCacheUrl = "/__eurconverted-rate-table__";
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

function isCachedRate(value: unknown): value is CachedRate {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CachedRate).rate === "number" &&
    typeof (value as CachedRate).date === "string"
  );
}

function isCachedRateTable(value: unknown): value is CachedRateTable {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every(isCachedRate)
  );
}

function syncMemoryRates(rateTable: CachedRateTable) {
  memoryRates.clear();

  Object.entries(rateTable).forEach(([cacheKey, cachedRate]) => {
    memoryRates.set(cacheKey, cachedRate);
  });
}

function readRateTable(): CachedRateTable {
  const cachedTable = localStorage.getItem(rateTableCacheKey);

  if (!cachedTable) {
    return {};
  }

  try {
    const rateTable = JSON.parse(cachedTable) as unknown;

    return isCachedRateTable(rateTable) ? rateTable : {};
  } catch {
    return {};
  }
}

async function readPersistentRateTable(): Promise<CachedRateTable> {
  if (!("caches" in window)) {
    return {};
  }

  try {
    const cache = await caches.open(persistentCacheName);
    const response = await cache.match(persistentCacheUrl);
    const rateTable = (await response?.json()) as unknown;

    return isCachedRateTable(rateTable) ? rateTable : {};
  } catch {
    return {};
  }
}

async function writePersistentRateTable(rateTable: CachedRateTable) {
  if (!("caches" in window)) {
    return;
  }

  try {
    const cache = await caches.open(persistentCacheName);
    const response = new Response(JSON.stringify(rateTable), {
      headers: { "Content-Type": "application/json" },
    });

    await cache.put(persistentCacheUrl, response);
  } catch {
    return;
  }
}

function writeRateTable(rateTable: CachedRateTable) {
  syncMemoryRates(rateTable);
  localStorage.setItem(rateTableCacheKey, JSON.stringify(rateTable));
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

export async function hydrateCachedRates(): Promise<boolean> {
  removeLegacyRateCaches();

  const rateTable = readRateTable();

  if (Object.keys(rateTable).length > 0) {
    syncMemoryRates(rateTable);
    await writePersistentRateTable(rateTable);
    return true;
  }

  const persistentRateTable = await readPersistentRateTable();

  if (Object.keys(persistentRateTable).length === 0) {
    return false;
  }

  writeRateTable(persistentRateTable);

  return true;
}

export async function replaceCachedRates(rates: CachedRateEntry[]) {
  removeLegacyRateCaches();

  const rateTable = rates.reduce<CachedRateTable>((table, { base, quote, rate, date }) => {
    const cacheKey = getRateCacheKey(base, quote);

    table[cacheKey] = { rate, date };

    return table;
  }, {});

  writeRateTable(rateTable);
  await writePersistentRateTable(rateTable);
}
