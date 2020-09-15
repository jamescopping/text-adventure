export class JSONUtil {
  static jsonObjArrayToMap(jsonObjArray, propertyKey) {
    const map = new Map();
    jsonObjArray.forEach((obj) => {
      map.set(obj[propertyKey], obj);
    });
    return map;
  }

  static loadFromJSON(classObj, json) {
    for (const key in json) {
      if (json.hasOwnProperty(key) && classObj.hasOwnProperty(key)) {
        classObj[key] = json[key];
      }
    }
  }
}
