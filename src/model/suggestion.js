import { operand } from "./operand";

export const suggestion = {
    list: [],
    index: -1,
    error: "",

    populateList: function (array, compareString, property = "") {
        if (property === "") {
            this.setList(array.filter(element => element.startsWith(compareString)));
        } else {
            let filteredArray = [];
            array.forEach(element => { if (element.hasOwnProperty(property) && element[property].startsWith(compareString)) filteredArray.push(element) });
            this.setList(filteredArray);
        }
    },

    generateError() {
        if (this.isListEmpty()) {
            this.setError(`[Error] No such ${operand.getType()}`);
            return true;
        } else {
            this.setError("");
            return false;
        }
    },

    isListEmpty: function () { return this.list.length === 0; },
    isError: function () { return this.error !== ""; },

    setError: function (newError) { this.error = newError; },
    setList: function (newList) { this.list = newList; },
    getError: function () { return this.error; },
    getList: function () { return this.list; },
};