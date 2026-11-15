import data from '../data/vehicles.json';
export type Mode = 'walking' | 'driving';
export interface Interaction { mode: Mode; distance: number; speed: number; exitClear: boolean }
export function interact({mode, distance, speed, exitClear}: Interaction): Mode {
  if (mode === 'walking') return distance <= data.pandora.entryDistance ? 'driving' : mode;
  return Math.abs(speed) <= data.pandora.exitMaxSpeed && exitClear ? 'walking' : mode;
}
