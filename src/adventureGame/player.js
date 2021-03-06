import { Stats } from "./stats";
import { ResourceType } from "./resource";
import { Inventory } from "./inventory";
import { log } from "../controller/adventureLogController";
import { QuestLog } from "./quest"
import { Game } from "./game";
import { MobStatus } from "./stats";

export class Player {
	constructor() {

	}

	init() {
		this.questLog = new QuestLog();
		this.stats = new Stats([{
			resourceType: ResourceType.HEALTH,
			currentValue: 100,
			maxValue: 100
		}, {
			resourceType: ResourceType.MANA,
			currentValue: 10,
			maxValue: 56,
		},
		{
			resourceType: ResourceType.STAMINA,
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
	getStats() { return this.stats }

	isAlive() { return this.stats.getStatus() !== MobStatus.DEAD }
	setStatus(status) { this.stats.setStatus(status) }

	loadStoryPlayerObj(playerObj) {
		const startingInv = playerObj.player.inventory;
		if (Array.isArray(startingInv)) {
			this.inventory.addItems(startingInv);
		} else if (typeof startingInv === "object" && startingInv.hasOwnProperty("inventoryItem")) {
			this.inventory.addItem(startingInv.inventoryItem);
		}
		const stats = playerObj.player.stats;
		stats.resources.forEach(resource => {
			const statResource = this.stats.getResourceOfType(resource.resourceType);
			statResource.setCurrentValue(resource.currentValue);
			statResource.setMaxValue(resource.maxValue);
		});
		this.stats.setInitiativeBonus(stats.initiativeBonus);
		this.stats.setArmourClass(stats.armourClass);
		this.stats.setAttackBonus(stats.attackBonus);
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