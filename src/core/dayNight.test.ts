import { describe, expect, it } from 'vitest';
import { advanceTime, clockText, daylight, isNight } from './dayNight';
import config from '../data/game.json';
describe('ciclo dia/noite', () => {
  it('completa um dia e atravessa meia-noite', () => {
    expect(advanceTime(16, config.clock.dayLengthSeconds)).toBeCloseTo(16);
    expect(advanceTime(23, config.clock.dayLengthSeconds / 12)).toBeCloseTo(1);
  });
  it('tem sol ao meio-dia e faróis à noite', () => {
    expect(daylight(12)).toBeCloseTo(1);
    expect(daylight(0)).toBe(0);
    expect(isNight(12)).toBe(false);
    expect(isNight(23)).toBe(true);
    expect(isNight(6)).toBe(true);
    expect(isNight(18)).toBe(true);
  });
  it('normaliza horários e formata o relógio', () => {
    expect(clockText(24)).toBe('00:00');
    expect(clockText(9.5)).toBe('09:30');
    expect(daylight(36)).toBeCloseTo(daylight(12));
    expect(advanceTime(10, -1)).toBe(10);
  });
});
