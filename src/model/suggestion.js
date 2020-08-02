export const suggestion = {
    list: [],
    index: -1,
    error: "",

    populateList: function (array, compareString) {
        this.list = array.filter(element => {
            return element.startsWith(compareString);
        });
    },
    resetError: function () {
        this.error = "";
    },
    resetList: function () {
        this.list = [];
    },
    isListEmpty: function () {
        return this.list.length === 0;
    },
    isError: function () {
        return this.error !== "";
    },
};