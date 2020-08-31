import { Stats } from "./stats";
import { ResourceType } from "./resource";
import { Inventory } from "./inventory";
import { log } from "../controller/adventureLogController";
import { QuestLog } from "./quest"

export class Player {
	constructor() {
		this.questLog = new QuestLog();
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
			outString += `${itemObj["quantity"]} x `;
		}
		outString += `[${itemObj["name"]}] added to your inventory`;
		log(outString);
	}

	getQuestLog() { return this.questLog }
	getInventory() { return this.inventory }
	getKnownSpells() { return this.knownSpells }

	toString() { return `Health: ${this.stats.getResourceOfType(ResourceType.HEALTH).toString()}`; }
}

export const PlayerAction = {
	PICKUP: 'pickup',
	DROP: 'drop',
	INVESTIGATE: 'investigate',
	GIVE: 'give',
	KILL: 'kill',
	SELL: 'sell',
	DISCOVER: 'discover',
	USE: 'use',
	TALKTO: 'talkto'
}

export class PlayerEvent {
	constructor(action = null, subject = null, object = null, amount = null, ...args) {
		this.action = action;
		this.subject = subject;
		this.object = object;
		this.amount = amount;
	}

	static broadcastPlayerEvent(playerEvent) {
		console.log(playerEvent);
		QuestLog.receivePlayerEvent(playerEvent);
	}
}