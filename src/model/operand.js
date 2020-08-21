import { OperandList } from "../game/definitions";
import { CommandSet } from "../game/command";
import { game } from "../game/game";
export const operand = {
    list: [],
    type: "",

    setType: function (newType) {
        this.type = newType
        switch (this.type) {
            case OperandList.KNOWN_SPELL:
                this.setList([...(game.getPlayer().getKnownSpells())]);
                break;
            case OperandList.ITEM:
                this.setList(game.getCurrentScene().getItems().map(itemObj => itemObj["name"]));
                break;
            case OperandList.INVENTORY:
                this.setList(game.getPlayer().getInventory().getList().map(itemObj => itemObj["name"]));
                break;
            case OperandList.MOB:
                this.setList([...(game.getCurrentScene().getMobs())]);
                break;
            case OperandList.OBJECT:
                this.setList([...(game.getCurrentScene().getObjects())]);
                break;
            case OperandList.PATH:
                this.setList(Object.keys(game.getCurrentScene().getPaths()));
                break;
            case OperandList.COMMAND:
                this.setList([...(CommandSet.keys())]);
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