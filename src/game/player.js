import { Stats } from "./stats";
import { ResourceType } from "./resource";
import { Inventory } from "./inventory";
import { ItemMap } from "./definitions";
export class Player {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.stats = new Stats([
            {
                type: ResourceType.HEALTH,
                currentValue: 100,
                maxValue: 100
            }, {
                type: ResourceType.MANA,
                currentValue: 10,
                maxValue: 56
            }, {
                type: ResourceType.STAMINA,
                currentValue: 20,
                maxValue: 999
            }
        ]);
        this.spells = ["fire_bolt", "magic_missile"];
        this.inventory = new Inventory([], 100);
        this.test();
    }

    test() {
        this.inventory.addItems(["key#1", "key#2", "dinner-plate", "sword"]);

        this.inventory.getList().forEach(item => {
            console.log(ItemMap.get(item).name);
        })
    }

    getInventoryList() { return this.inventory }
    toString() { return `Name: ${this.name}, Age: ${this.age}, Health: ${this.stats.getResourceOfType(ResourceType.HEALTH).toString()}` }

}