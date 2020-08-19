import { OperandType } from "../game/definitions";
import { CommandSet } from "../game/command";
import { Story } from "../game/story";
export const operand = {
    list: [],
    type: "",

    setType: function (newType) {
        this.type = newType
        switch (this.type) {
            case OperandType.SPELL:
                this.setList([...(Story.getSpellMap().keys())]);
                break;
            case OperandType.ITEM:
                this.setList([...(Story.getItemMap().keys())]);
                break;
            case OperandType.COMMAND:
                this.setList([...(CommandSet.values())]);
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