import { CommandMap } from "../adventureGame/command";
import { Game } from "../adventureGame/game";
import { getResponseMap } from "../controller/adventureLogController";


export const OperandList = {
	COMMAND: "command",
	OBJECT: "object",
	MOB: "mob",
	ITEM: "item",
	PATH: "path",
	INVENTORY: "inventory",
	KNOWN_SPELL: "known_spell",
	RESPONSE: "response",
	LOOK: "look",
	USE: "use"
}

export const operand = {
	list: [],
	type: "",

	setType: function (newType) {
		this.type = newType
		switch (this.type) {
			case OperandList.KNOWN_SPELL:
				this.setList([...(Game.getPlayer().getKnownSpells())]);
				break;
			case OperandList.ITEM:
				this.setList(Game.getCurrentScene().getItems().map(itemObj => itemObj["itemName"]));
				break;
			case OperandList.INVENTORY:
				this.setList(Game.getPlayer().getInventory().getList().map(itemObj => itemObj["itemName"]));
				break;
			case OperandList.MOB:
				this.setList(Game.getCurrentScene().getMobs().map(mobName => mobName["mobName"]));
				break;
			case OperandList.OBJECT:
				this.setList([...(Game.getCurrentScene().getObjects().map(objectName => objectName["objectName"]))]);
				break;
			case OperandList.PATH:
				this.setList(Object.keys(Game.getCurrentScene().getPaths()));
				break;
			case OperandList.COMMAND:
				this.setList(CommandMap.get(Game.getGameMode()));
				break;
			case OperandList.RESPONSE:
				Game.getDialog().setResponses(getResponseMap());
				this.setList([...Game.getDialog().getResponses().keys()]);
				break;
			case OperandList.LOOK:
				this.setList(["items", "objects", "mobs", ""]);
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