function objectToMap(obj: { [key: string]: any }): Map<string, any> {
  let m = new Map();
  for (let k of Object.keys(obj)) {
    if (obj[k] instanceof Object) {
      m.set(k, objectToMap(obj[k]));
    } else {
      m.set(k, obj[k]);
    }
  }
  return m;
}

export default objectToMap;

// https://www.xul.fr/javascript/map-and-object.php
