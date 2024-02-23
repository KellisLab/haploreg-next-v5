function mapToObjectRec(m: Map<string, any>): { [key: string]: any } {
  let lo: { [key: string]: any } = {};
  for (let [k, v] of m) {
    if (v instanceof Map) {
      lo[k] = mapToObjectRec(v);
    } else {
      lo[k] = v;
    }
  }
  return lo;
}

export default mapToObjectRec;

// https://www.xul.fr/javascript/map-and-object.php
