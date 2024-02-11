function sigmoid(x: number): number {
  return 1 / (1 + Math.E ** (0.1 * x - 10));
}

function enhancement(pos: number, start: number, stop: number): number[] {
  if (pos <= stop && pos >= start) {
    // if pos inbetween start/stop -> 1
    return [1, 0];
  }
  const min_dist = Math.min(Math.abs(pos - start), Math.abs(pos - stop));
  if (min_dist < 2500) {
    return [sigmoid(min_dist), min_dist];
  } // some sort of valid overlap
  return [0, 0];
}

export default enhancement;
