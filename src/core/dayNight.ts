import config from '../data/game.json';
export function advanceTime(hour: number, seconds: number): number {
  return ((hour + Math.max(0, seconds) * 24 / config.clock.dayLengthSeconds) % 24 + 24) % 24;
}
export function daylight(hour: number): number {
  const normalized = ((hour % 24) + 24) % 24;
  return Math.max(0, Math.sin((normalized - config.clock.sunrise) / (config.clock.sunset - config.clock.sunrise) * Math.PI));
}
export function isNight(hour: number): boolean { return daylight(hour) < 0.12; }
export function clockText(hour: number): string {
  const minutes = Math.floor((((hour % 24) + 24) % 24) * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
