export class JSONUtil {
    static jsonObjArrayToMap(jsonObjArray, propertyKey) {
        const map = new Map();
        jsonObjArray.forEach(obj => {
            map.set(obj[propertyKey], obj);
        });
        return map;
    }
}