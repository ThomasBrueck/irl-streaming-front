import { DIAL_STATIONS } from "./landingContent";

/** The needle counts as "tuned in" when it is this close to a station. */
export const TUNED_WITHIN = 3;

export function nearestStation(pos: number): number {
  let best = 0;
  DIAL_STATIONS.forEach((s, i) => {
    if (Math.abs(s.pos - pos) < Math.abs(DIAL_STATIONS[best].pos - pos)) best = i;
  });
  return best;
}

export function signalDistance(pos: number): number {
  return Math.abs(DIAL_STATIONS[nearestStation(pos)].pos - pos);
}

/** 0 when the signal is clean, 1 when the needle is far from any station. */
export function noiseLevel(pos: number): number {
  return Math.min(1, Math.max(0, (signalDistance(pos) - 2) / 10));
}
