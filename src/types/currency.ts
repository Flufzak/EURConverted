export interface CurrencyOption {
  code: CurrencyCode
  name: string
  symbol: string
}

export type CurrencyCode = 'EUR' | 'AMD' | 'USD'

export type CurrencyPair = readonly [CurrencyCode, CurrencyCode]

export interface CachedRate {
  rate: number
  date: string
}

export interface CachedRateEntry extends CachedRate {
  base: CurrencyCode
  quote: CurrencyCode
}
