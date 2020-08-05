import { Stats } from "./stats";
import { ResourceType } from "./resource";
import { SpellList } from "./definitions";
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
        this.spells = [SpellList.FIREBOLT.name];
    }

    toString() { return `Name: ${this.name}, Age: ${this.age}, Health: ${this.stats.getResourceOfType(ResourceType.HEALTH).toString()}` }

}