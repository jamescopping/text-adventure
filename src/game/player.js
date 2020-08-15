import {
  Stats
} from "./stats";
import {
  ResourceType
} from "./resource";
import {
  Inventory
} from "./inventory";

export class Player {
  constructor() {
    this.stats = new Stats([{
      type: ResourceType.HEALTH,
      currentValue: 100,
      maxValue: 100
    }, {
      type: ResourceType.MANA,
      currentValue: 10,
      maxValue: 56,
    },
    {
      type: ResourceType.STAMINA,
      currentValue: 20,
      maxValue: 999,
    },
    ]);
    this.knownSpells = ["fire_bolt", "magic_missile"];
    this.inventory = new Inventory(
      ["key#1", "key#2"],
      100
    );
  }


  toString() {
    return `Health: ${this.stats
      .getResourceOfType(ResourceType.HEALTH)
      .toString()}`;
  }
}