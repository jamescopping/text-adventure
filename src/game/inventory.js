import { ItemMap } from "./definitions";
export class Inventory {

    constructor(itemList, maxWeight) {
        this.list = [...itemList];
        this.maxWeight = maxWeight;
    }


    getList() { return this.list }
    listSize() { return this.list.length }
    addItems(itemNameList) { itemNameList.forEach(itemName => this.addItem(itemName)) }
    addItem(itemName) { if (ItemMap.has(itemName)) this.list.push(itemName); }

    getItemAtIndex(index) {

        if (this.listSize() > 0 && (index <= this.listSize() && index >= 0)) {
            return this.list[index];
        }
        return null;
    }

    removeItem(itemID) {
        let itemIndex = this.hasItem(itemID);
        if (itemIndex === -1) return null;
        return this.list.splice(itemIndex, 1)[0];
    }

    hasItem(itemID) {
        for (let i = 0; i < this.listSize(); i++) {
            if (this.list[i] === itemID) return i;
        }
        return -1;
    }
}