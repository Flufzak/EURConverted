import type { CurrencyOption, CurrencyPair } from '../types/currency'

export const currencies: CurrencyOption[] = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
]

export const refreshRatePairs: CurrencyPair[] = [
  ['EUR', 'AMD'],
  ['EUR', 'USD'],
  ['AMD', 'USD'],
]
