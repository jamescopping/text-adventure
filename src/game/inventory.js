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
		const { itemName, quantity } = newItemObj;
		console.log(newItemObj, itemName);
		if (Story.getItemMap().has(itemName)) {
			let itemAlreadyIn = false;
			let newTotal = quantity;
			for (let index = 0; index < this.list.length; index++) {
				if (this.list[index]["itemName"] === itemName) {
					this.list[index]["quantity"] += quantity;
					newTotal = this.list[index]["quantity"];
					itemAlreadyIn = true;
					break;
				}
			}
			if (!itemAlreadyIn) this.list.push({ itemName: itemName, quantity: quantity });
			if (this.player) {
				PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, itemName, quantity));
				PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, "add", "type", `${this.getItemType(itemName)}`, quantity));
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
		this.list.some((itemObj, index) => {
			if (itemName === itemObj["itemName"]) {
				itemIndex = index;
				return true;
			}
			return false;
		});
		return itemIndex;
	}

	getItem(itemName) {
		const index = this.getIndex(itemName);
		return this.getItemAtIndex(index);
	}

	getItemListOfType(itemType, rarity = "") {
		const itemList = this.list.filter(itemObj => {
			if (itemType === this.getItemType(itemObj["itemName"])) {
				if (rarity !== "") {
					return rarity === this.getItemRarity(itemObj["itemName"]);
				}
				return true;
			}
			return false;
		});
		return itemList.sort((a, b) => b.quantity - a.quantity);
	}

	removeItemType(itemType, rarity = "", quantity = -1, quest = false) {
		const foundItemList = this.getItemListOfType(itemType, rarity);
		if (foundItemList.length === 0) return false;
		if (foundItemList[0].quantity < quantity) return false;
		return this.removeItem(foundItemList[0]["itemName"], quantity, quest);
	}

	removeItem(itemName, quantity = -1, quest = false) {
		let itemIndex = this.getIndex(itemName);
		if (itemIndex === -1) return null;
		let invItem = this.getItemAtIndex(itemIndex);
		if (!quest && this.getItemRarity(itemName) === "quest") return null;

		let removedItem = {};
		if (quantity < 0 || quantity === invItem.quantity) { //remove all of that item
			removedItem = this.list.splice(itemIndex, 1)[0];
			quantity = removedItem.quantity;
		} else if (quantity <= invItem.quantity) {
			invItem.quantity -= quantity;
			removedItem = { ...invItem };
			removedItem.quantity = quantity;
		} else {
			return false;
		}
		if (this.player) {
			PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, removedItem["itemName"], -quantity));
			PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVENTORY_UPDATE, "remove", "type", `${this.getItemType(removedItem["itemName"])}`, quantity));
		}
		return removedItem;
	}

	hasItem(itemName) { return this.list.some(itemObj => itemName === itemObj["itemName"]) }
	hasItemType(itemType) { return this.list.some(itemObj => itemType === this.getItemType(itemObj["itemName"])) }

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
