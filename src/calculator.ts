export interface CleaningCalculationInput {
  area: number;
  cleaningType: 'general' | 'after_repair' | 'maintenance';
  extraOptions?: {
    dryCleanSofa?: boolean;
    cleanOven?: boolean;
    cleanFridge?: boolean;
  };
}

export interface CleaningCalculationResult {
  basePrice: number;
  extrasPrice: number;
  totalPrice: number;
  ratePerSquareMeter: number;
  estimatedHours: string;
  recommendedCleaners: number;
}

export const RATES = {
  general: 120, // 120 ₽/м² per prompt requirement
  after_repair: 180, // 180 ₽/м² per prompt requirement
  maintenance: 90, // Supporting daily/maintenance
} as const;

export const EXTRA_PRICES = {
  dryCleanSofa: 2500,
  cleanOven: 1200,
  cleanFridge: 1000,
} as const;

export function calculateCleaningPrice(input: CleaningCalculationInput): CleaningCalculationResult {
  const safeArea = Math.max(1, Math.min(10000, Number(input.area) || 0));
  const rate = RATES[input.cleaningType] || RATES.general;
  const basePrice = Math.round(safeArea * rate);

  let extrasPrice = 0;
  if (input.extraOptions?.dryCleanSofa) extrasPrice += EXTRA_PRICES.dryCleanSofa;
  if (input.extraOptions?.cleanOven) extrasPrice += EXTRA_PRICES.cleanOven;
  if (input.extraOptions?.cleanFridge) extrasPrice += EXTRA_PRICES.cleanFridge;

  const totalPrice = basePrice + extrasPrice;

  // Estimation of cleaners & hours
  let recommendedCleaners = 1;
  let estimatedHours = '3-4 часа';

  if (safeArea <= 45) {
    recommendedCleaners = 1;
    estimatedHours = input.cleaningType === 'after_repair' ? '4-5 часов' : '3-4 часа';
  } else if (safeArea <= 80) {
    recommendedCleaners = 2;
    estimatedHours = input.cleaningType === 'after_repair' ? '5-7 часов' : '4-5 часов';
  } else if (safeArea <= 150) {
    recommendedCleaners = 3;
    estimatedHours = input.cleaningType === 'after_repair' ? '6-8 часов' : '5-6 часов';
  } else {
    recommendedCleaners = Math.ceil(safeArea / 50);
    estimatedHours = '6-9 часов (бригада)';
  }

  return {
    basePrice,
    extrasPrice,
    totalPrice,
    ratePerSquareMeter: rate,
    estimatedHours,
    recommendedCleaners,
  };
}

export function formatRubles(amount: number): string {
  return amount.toLocaleString('ru-RU') + ' ₽';
}
