export interface CurrencyOption {
  code: CurrencyCode
  name: string
  symbol: string
}

export type CurrencyCode = 'EUR' | 'AMD' | 'USD'

export interface CachedRate {
  rate: number
  date: string
}
