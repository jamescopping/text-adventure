import { Stats } from "./stats";
import { ResourceType } from "./resource";
import { Inventory } from "./inventory";
import { log } from "../controller/adventureLogController";
import { QuestLog } from "./quest"
import { game } from "./game";

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
		this.inventory = new Inventory([{ name: "blue_crystal", quantity: 1 }], 100, true);
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
	START: 'start',
	PICKUP: 'pickup',
	INVENTORY_UPDATE: 'inventory_update',
	DROP: 'drop',
	INVESTIGATE: 'investigate',
	GIVE: 'give',
	KILL: 'kill',
	SELL: 'sell',
	DISCOVER: 'discover',
	USE: 'use',
	TALKTO: 'talkto',
	RECEIVE_QUEST: 'receiveQuest'
}

export class PlayerEvent {
	constructor(action, ...args) {
		this.action = action;
		this.args = args;
		try {
			if (!Object.values(PlayerAction).includes(this.action)) throw new PlayerEventError(this, "Action not found in PlayerAction list")
		} catch (error) {
			console.error(error);
		}
	}

	getAction() { return this.action }
	getArgs() { return this.args }

	static broadcastPlayerEvent(playerEvent) {
		PlayerEvent.addEventToList(playerEvent);
		game.getPlayer().getQuestLog().receivePlayerEvent(playerEvent);
	}

	static addEventToList(playerEvent) { PlayerEvent.eventList.push(playerEvent) }
	static getPlayerEventList() { return PlayerEvent.eventList }
	static getAllEventsWithAction(playerAction) { return PlayerEvent.eventList.filter(event => playerAction === event.getAction()) }
}

PlayerEvent.eventList = [];

class PlayerEventError extends Error {
	constructor(playerEvent, ...params) {
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super(...params);
		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, PlayerEventError);
		}
		this.name = 'PlayerEventError';
		this.playerEvent = playerEvent;
	}
}