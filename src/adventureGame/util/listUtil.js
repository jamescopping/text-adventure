
export class ListUtil {

    /**
     * Filter list that starts with compareString while looking at a given property
     * @param {Array} list to be filtered
     * @param {String} compareString compare this string to return a filtered list 
     * @param {String} property of an object to compare against 
     * @returns {Array} filteredArray
     */
    static filterListStartsWith(list, compareString) {
        return list.filter(element => element.startsWith(compareString));
    }
}
