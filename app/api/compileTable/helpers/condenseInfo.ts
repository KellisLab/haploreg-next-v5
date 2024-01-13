/**
 *
 * @param n
 * @returns
 */
export function humanReadable(n: number): string {
  if (n < 1000) {
    return `${n}bp`;
  }
  if (n < 10000) {
    return `${(n / 1000).toFixed(1)}kb`;
  }
  if (n < 1000000) {
    return `${Math.round(n / 1000)}kb`;
  }
  if (n < 10000000) {
    return `${(n / 1000000).toFixed(1)}Mb`;
  } else {
    return `${Math.round(n / 1000000)}Mb`;
  }
}

/**
 *
 * @param sequence
 * @param maxLength
 * @returns condensed string if sequence with commas is longer than maxLength
 */
export function condenseOligos(sequence: string, maxLength: number): string {
  if (maxLength === 0) {
    return sequence;
  } else if (sequence.length > maxLength) {
    return sequence.length + "-mer";
  } else {
    return sequence;
  }
}

/**
 *
 * @param list
 * @param message
 * @returns
 */
export function condenseLists(
  list: Array<string>,
  message: string,
  maxLength: number
): string {
  if (list.length > maxLength) {
    if (message === " tissues" && list.length === 1) {
      return list.length + " organ";
    } else {
      return list.length + message;
    }
  } else {
    return list.join(", ");
  }
}
