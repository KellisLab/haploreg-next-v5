const MIN_DIST = 10;
function sigmoid(x: number): number {
  return 1 / (1 + Math.E ** (0.1 * x - 10));
}

function enhancement(pos: number, start: number, stop: number): number[] {
  if (pos <= stop && pos >= start) {
    // if pos inbetween start/stop -> 1
    // return [1, 0];
    return [sigmoid(MIN_DIST), MIN_DIST];
  }
  const min_dist = Math.min(Math.abs(pos - start), Math.abs(pos - stop));
  return [sigmoid(min_dist), min_dist]; // some sort of valid overlap
  // this should always be less than 3001
}

export default enhancement;
