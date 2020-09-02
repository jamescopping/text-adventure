import { Story } from "./story";
import { PlayerEvent, PlayerAction } from "./player";
export class Inventory {
	constructor(itemList, maxWeight, player = false) {
		this.list = [...itemList];
		this.maxWeight = maxWeight;
		this.player = player;
	}

	getList() { return this.list }
	listSize() { return this.list.length }
	addItems(itemObjList) { itemObjList.forEach(itemObj => this.addItem(itemObj)) }
	addItem(newItemObj) {
		const { name, quantity } = newItemObj;
		if (Story.getItemMap().has(name)) {
			let itemAlreadyIn = false;
			let newTotal = quantity;
			for (let index = 0; index < this.list.length; index++) {
				if (this.list[index]["name"] === name) {
					this.list[index]["quantity"] += quantity;
					newTotal = this.list[index]["quantity"];
					itemAlreadyIn = true;
					break;
				}
			}
			if (!itemAlreadyIn) this.list.push(newItemObj);
			if (this.player) {
				PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, name, newTotal));
				PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, "add", "type", `${this.getItemType(name)}`, quantity));
			}
		}
	}

	getItemAtIndex(index) {
		if (this.listSize() > 0 && (index <= this.listSize() && index >= 0)) {
			return this.list[index];
		}
		return null;
	}

	getIndex(itemName) {
		let itemIndex = -1;
		this.list.forEach((itemObj, index) => { if (itemName === itemObj["name"]) itemIndex = index });
		return itemIndex;
	}

	getItem(itemName) {
		const index = this.getIndex(itemName);
		return this.getItemAtIndex(index);
	}

	removeItem(itemName) {
		let itemIndex = this.getIndex(itemName);
		if (itemIndex === -1) return null;
		if (this.getItemRarity(itemName) === "quest") return null;
		const item = this.list.splice(itemIndex, 1)[0];
		if (this.player) {
			PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, item["name"], 0));
			PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, "remove", "type", `${this.getItemType(item["name"])}`, -999));
		}
		return item;
	}

	hasItem(itemName) {
		let foundItem = false;
		this.list.forEach(itemObj => { if (itemName == itemObj["name"]) foundItem = true; });
		return foundItem;
	}

	getItemProperty(itemName, property) {
		const item = Story.getItemMap().get(itemName);
		if (item !== undefined && item.hasOwnProperty(property)) return item[property];
		return undefined;
	}

	getItemRarity(itemName) {
		return Story.getItemMap().get(itemName)["rarity"];
	}

	getItemType(itemName) {
		return Story.getItemMap().get(itemName)["type"];
	}
}
