import { Stats } from "./stats";
import { ResourceType } from "./resource";
import { Inventory } from "./inventory";
import { log } from "../controller/adventureLogController";
import { QuestLog } from "./quest"
import { Game } from "./game";
import { MobStatus } from "./definitions";

export class Player {
	constructor() {
		this.questLog = new QuestLog();
		this.status = MobStatus.ALIVE;
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
			maxValue: 20,
		}
		]);
		this.knownSpells = [];
		this.inventory = new Inventory([], 100, true);
	}

	pickupItem(itemObj) {
		this.getInventory().addItem(itemObj);
		let outString = "";
		if (itemObj["quantity"] > 1) {
			outString += `${itemObj["quantity"]} x `;
		}
		outString += `[${itemObj["itemName"]}] added to your inventory`;
		log(outString);
	}

	getQuestLog() { return this.questLog }
	getInventory() { return this.inventory }
	getKnownSpells() { return this.knownSpells }

	isAlive() { this.status !== MobStatus.DEAD }
	setStatus(status) { this.status = status }

	loadStoryPlayerObj(playerObj) {
		const startingInv = playerObj.player.inventory;
		if (Array.isArray(startingInv)) {
			this.inventory.addItems(startingInv);
		} else if (typeof startingInv === "object" && startingInv.hasOwnProperty("inventoryItem")) {
			this.inventory.addItem(startingInv.inventoryItem);
		}
		const stats = playerObj.player.stats;
		const statKeys = Object.keys(stats);
		statKeys.forEach(statType => {
			const statResource = this.stats.getResourceOfType(statType);
			statResource.setCurrentValue(stats[statType].currentValue);
			statResource.setMaxValue(stats[statType].maxValue);
		});
		//known spells
		const knownSpells = playerObj.player.knownSpells;
		this.knownSpells = (knownSpells !== undefined) ? knownSpells.split(",") : [];
		if (this.knownSpells[0] === "") this.knownSpells = [];
	}

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
	QUEST_HAND_IN: 'quest_hand_in'
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
		Game.getPlayer().getQuestLog().receivePlayerEvent(playerEvent);
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