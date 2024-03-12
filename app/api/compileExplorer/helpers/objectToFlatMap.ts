function objectToFlatMap(obj: { [key: string]: any }): Map<string, any> {
  let m = new Map();
  for (let k of Object.keys(obj)) {
    m.set(k, obj[k]);
  }
  return m;
}

export default objectToFlatMap;
