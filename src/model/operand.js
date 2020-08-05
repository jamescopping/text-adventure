export const operand = {
    list: [],
    type: "",
    property: "",

    isPropertySet: function () { return this.property !== "" },

    setProperty: function (newProperty) { this.property = newProperty },
    setType: function (newType) { this.type = newType },
    setList: function (newList) { this.list = newList },
    getProperty: function () { return this.property },
    getType: function () { return this.type },
    getList: function () { return this.list },
};