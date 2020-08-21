import { Stats } from "./stats";
import { ResourceType } from "./resource";
import { Inventory } from "./inventory";
import { log } from "../controller/adventureLogController";

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
    this.knownSpells = ["fire_bolt"];
    this.inventory = new Inventory([{ name: "blue_crystal", quantity: 1 }], 100);
  }

  pickupItem(itemObj) {
    this.getInventory().addItem(itemObj);
    let outString = "";
    if (itemObj["quantity"] > 1) {
      outString += `(${itemObj["quantity"]}) x `;
    }
    outString += `[${itemObj["name"]}] added to your inventory`;
    log(outString);
  }

  getInventory() { return this.inventory }
  getKnownSpells() { return this.knownSpells }

  toString() { return `Health: ${this.stats.getResourceOfType(ResourceType.HEALTH).toString()}`; }
}