import { Story } from "./story";
export class Inventory {
  constructor(itemList, maxWeight) {
    this.list = [...itemList];
    this.maxWeight = maxWeight;
  }

  getList() { return this.list }
  listSize() { return this.list.length }
  addItems(itemNameList) { itemNameList.forEach(itemName => this.addItem(itemName)) }
  addItem(itemName) { if (Story.getItemMap().has(itemName)) this.list.push(itemName) }

  getItemAtIndex(index) {
    if (this.listSize() > 0 && (index <= this.listSize() && index >= 0)) {
      return this.list[index];
    }
    return null;
  }

  getIndex(itemName) {
    return this.list.indexOf(itemName);
  }

  getItem(itemName) {
    const index = this.getIndex(itemName);
    return this.getItemAtIndex(index);
  }

  removeItem(itemName) {
    let itemIndex = -1;
    if (this.hasItem(itemName)) {
      itemIndex = this.getIndex(itemName);
      if (itemIndex === -1) return null;
      if (this.getItemRarity(itemName) === "quest") return null;
    }
    return this.list.splice(itemIndex, 1)[0];
  }

  hasItem(itemName) {
    return this.list.includes(itemName);
  }

  getItemRarity(itemName) {
    return Story.getItemMap().get(itemName)["rarity"];
  }
}
