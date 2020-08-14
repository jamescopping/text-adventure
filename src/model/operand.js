import { OperandType, ItemMap, SpellMap } from "../game/definitions";
import { CommandSet } from "../game/command";
export const operand = {
    list: [],
    type: "",

    setType: function (newType) {
        this.type = newType
        switch (this.type) {
            case OperandType.SPELL:
                this.setList([...SpellMap.keys()]);
                break;
            case OperandType.ITEM:
                this.setList([...ItemMap.keys()]);
                break;
            case OperandType.COMMAND:
                this.setList([...CommandSet.values()]);
                break;
            default:
                this.setList([]);
                break;
        }

    },
    setList: function (newList) { this.list = newList },
    getType: function () { return this.type },
    getList: function () { return this.list },
};