
export class ListUtil {

    /**
     * Filter list that starts with compareString while looking at a given property
     * @param {Array} list to be filtered
     * @param {String} compareString compare this string to return a filtered list 
     * @param {String} property of an object to comare against 
     * @returns {Array} filteredArray
     */
    static filterListStartsWith(list, compareString, property = "") {
        if (property === "") {
            return list.filter(element => element.startsWith(compareString));
        } else {
            let filteredArray = [];
            list.forEach(element => { if (element.hasOwnProperty(property) && element[property].startsWith(compareString)) filteredArray.push(element) });
            return filteredArray;
        }
    }
}
