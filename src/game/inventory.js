import { Story } from "./story";
export class Inventory {
  constructor(itemList, maxWeight) {
    this.list = [...itemList];
    this.maxWeight = maxWeight;
  }

  getList() { return this.list }
  listSize() { return this.list.length }
  addItems(itemObjList) { itemObjList.forEach(itemObj => this.addItem(itemObj)) }
  addItem(newItemObj) {
    if (Story.getItemMap().has(newItemObj["name"])) {
      let itemAlreadyIn = false;
      for (let index = 0; index < this.list.length; index++) {
        if (this.list[index]["name"] === newItemObj["name"]) {
          this.list[index]["quantity"] += newItemObj["quantity"];
          itemAlreadyIn = true;
          break;
        }
      }
      if (!itemAlreadyIn) this.list.push(newItemObj);
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
    return this.list.splice(itemIndex, 1)[0];
  }

  hasItem(itemName) {
    let foundItem = false;
    this.list.forEach(itemObj => { if (itemName == itemObj["name"]) foundItem = true; });
    return foundItem;
  }

  getItemRarity(itemName) {
    return Story.getItemMap().get(itemName)["rarity"];
  }
}
