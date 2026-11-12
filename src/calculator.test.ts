import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCleaningPrice, formatRubles, RATES } from './calculator.ts';

test('rates match prompt requirements', () => {
  assert.equal(RATES.general, 120, 'Генеральная уборка must be 120 ₽/m²');
  assert.equal(RATES.after_repair, 180, 'После ремонта must be 180 ₽/m²');
});

test('calculateCleaningPrice for 100m2 general cleaning', () => {
  const result = calculateCleaningPrice({
    area: 100,
    cleaningType: 'general',
  });
  assert.equal(result.basePrice, 12000);
  assert.equal(result.totalPrice, 12000);
  assert.equal(result.ratePerSquareMeter, 120);
  assert.equal(result.recommendedCleaners, 3);
});

test('calculateCleaningPrice for 60m2 after renovation with oven cleaning', () => {
  const result = calculateCleaningPrice({
    area: 60,
    cleaningType: 'after_repair',
    extraOptions: { cleanOven: true },
  });
  // 60 * 180 = 10800 + 1200 = 12000
  assert.equal(result.basePrice, 10800);
  assert.equal(result.extrasPrice, 1200);
  assert.equal(result.totalPrice, 12000);
});

test('formatRubles formats correctly', () => {
  assert.match(formatRubles(12000), /12[ \u00A0\u202F]?000 ₽/);
});
