import type { CachedRate, CurrencyCode } from '../types/currency'

const apiBaseUrl = 'https://api.frankfurter.dev'

interface FrankfurterRateResponse {
  rate: number
  date?: string
}

type FrankfurterRatesResponse = FrankfurterRateResponse[]

function isValidRateResponse(data: unknown): data is FrankfurterRateResponse {
  return typeof data === 'object' && data !== null && typeof (data as FrankfurterRateResponse).rate === 'number'
}

function toCachedRate(data: FrankfurterRateResponse): CachedRate {
  return {
    rate: data.rate,
    date: data.date ?? new Date().toISOString().slice(0, 10),
  }
}

async function readRateResponse(response: Response): Promise<FrankfurterRateResponse> {
  const data = (await response.json()) as unknown

  if (!isValidRateResponse(data)) {
    throw new Error('Could not load exchange rate')
  }

  return data
}

async function fetchPairRate(base: CurrencyCode, quote: CurrencyCode): Promise<CachedRate> {
  const response = await fetch(`${apiBaseUrl}/v2/rate/${base}/${quote}`)

  if (!response.ok) {
    throw new Error('Could not load exchange rate')
  }

  return toCachedRate(await readRateResponse(response))
}

async function fetchFilteredRate(base: CurrencyCode, quote: CurrencyCode): Promise<CachedRate> {
  const response = await fetch(`${apiBaseUrl}/v2/rates?base=${base}&quotes=${quote}`)

  if (!response.ok) {
    throw new Error('Could not load exchange rate')
  }

  const data = (await response.json()) as FrankfurterRatesResponse
  const rate = data[0]

  if (!isValidRateResponse(rate)) {
    throw new Error('Could not load exchange rate')
  }

  return toCachedRate(rate)
}

export async function fetchRate(base: CurrencyCode, quote: CurrencyCode): Promise<CachedRate> {
  if (base === quote) {
    return {
      rate: 1,
      date: new Date().toISOString().slice(0, 10),
    }
  }

  try {
    return await fetchPairRate(base, quote)
  } catch {
    return fetchFilteredRate(base, quote)
  }
}
