import { Dice } from "./dice";
import { Game, GameMode } from "./game";
import { Story } from "./story";
import { triggerAlert } from "../controller/alertController";
import { PlayerEvent, PlayerAction } from "./player";
import { Scene } from "./scene";
import { log, clearResponseClass, clearPathClass } from "../controller/adventureLogController";
import { MobStatus } from "./stats";

const adventureCommandList = ['/roll', '/help', '/save', 'inventory', 'stats', 'path', 'look', 'investigate', 'talkto', 'pickup', 'attack', 'loot', 'cast', 'drop', 'use', 'questlog'].sort();
const dialogCommandList = ['bye', 'response'].sort();
const combatCommandList = ['stats'];
export const CommandMap = new Map();

CommandMap.set(GameMode.ADVENTURE, adventureCommandList);
CommandMap.set(GameMode.DIALOG, dialogCommandList);
CommandMap.set(GameMode.COMBAT, combatCommandList);

export class Command {

	constructor(string) {
		let split = Command.splitCommand(string);
		this.action = split.action;
		this.operand = split.operand;
	}

	toString() { return `${this.action} ${(this.operand.length === 0) ? "" : this.operand.join(" ")}`; }

	static splitCommand(string) {
		string = string.toLowerCase();
		let firstSpaceIndex = string.indexOf(" ");
		return { action: string.substring(0, firstSpaceIndex), operand: string.substring(firstSpaceIndex + 1).split(" ") };
	}


	static lookForItems(sceneItems) {
		let count = 0;
		sceneItems.forEach(itemObj => {
			let outString = "";
			if (itemObj["quantity"] > 1) outString += `${itemObj["quantity"]} x `;
			outString += `[*${itemObj["itemName"]}*] ${itemObj["description"]}`;
			log(outString);
			count++;
		});
		return count;
	}

	static lookForObjects(sceneObjects) {
		let count = 0;
		sceneObjects.forEach(sceneObj => {
			let outString = "";
			outString += `(${sceneObj.objectName}) ${Story.getObject(sceneObj.objectName).description}`;
			log(outString);
			count++;
		});
		return count;
	}

	static lookForMobs(sceneMobs) {
		let count = 0;
		sceneMobs.forEach(mob => {
			if (mob.stats.getStatus() === MobStatus.ALIVE) {
				let outString = "";
				outString += `/**${mob.mobName}*\\ ${Story.getMob(mob.mobName).description}`;
				log(outString);
				count++;
			}
		});
		return count;
	}

	static look(lookFor) {
		const currentScene = Game.getCurrentScene();
		log(`You look around the ${currentScene.getName()} and you find...`);

		let logCount = 0;

		switch (lookFor.toLowerCase()) {
			case "items":
				logCount = this.lookForItems(currentScene.getItems());
				break;
			case "objects":
				logCount = this.lookForObjects(currentScene.getObjects());
				break;
			case "mobs":
				logCount = this.lookForMobs(currentScene.getMobs());
				break;
			case "":
				logCount += this.lookForItems(currentScene.getItems());
				logCount += this.lookForObjects(currentScene.getObjects());
				logCount += this.lookForMobs(currentScene.getMobs());
		}

		if (logCount === 0) log("nothing...");
		return true;
	}

	static path(direction) {
		const currentScene = Game.getCurrentScene();
		if (direction !== "") {
			if (!currentScene.getPaths().hasOwnProperty(direction)) return false;
			const sceneName = currentScene.getPaths()[direction];
			const sceneVisited = Scene.hasSceneBeenVisited(sceneName);
			if (Game.changeScene(sceneName)) {
				clearPathClass(direction);
				log(`You chose path ${direction}`);
				currentScene.init();
				/*	if discoverScene is false before and then true once the scene
					has been changed then that means the scene has been visited 
					for the first time, so a PLAYER EVENT: DISCOVER can be broadcast
				 */
				if (!sceneVisited) PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.DISCOVER, currentScene.getName()));
			} else {
				triggerAlert("alert-warning", `<strong>Path ${direction}</strong> not found`);
			}
		}
	}

	static pickup(itemName) {
		if (itemName !== "") {
			let sceneItem = Game.getCurrentScene().pickupItem(itemName);
			if (sceneItem !== null) {
				Game.getPlayer().pickupItem(sceneItem);
				PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.PICKUP, sceneItem["itemName"], sceneItem["quantity"]));
				return true;
			} else {
				triggerAlert("alert-warning", `Item [${itemName}] does not exist in this scene`);
				return false;
			}
		}
	}

	static drop(itemName) {
		if (itemName === "") return false;
		let itemObj = Game.getPlayer().getInventory().removeItem(itemName);
		if (itemObj !== null) {
			Game.getCurrentScene().getItems().push({ itemName: itemObj["itemName"], quantity: itemObj["quantity"], description: "dropped by player" });
			log(`Item [*${itemObj["itemName"]}*] x ${itemObj["quantity"]} dropped from inventory`);
			PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.DROP, itemObj["itemName"], itemObj["quantity"]));
			return true;
		} else {
			triggerAlert("alert-warning", `Item [${itemName}] can't be dropped from your inventory`);
			return false;
		}

	}

	static investigate(itemName) {
		if (Game.getPlayer().getInventory().hasItem(itemName)) {
			let item = Story.getItem(itemName);
			log(`You investigate [${item["name"]}]: ${item["description"]}`);
			PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.INVESTIGATE, item["name"]));
			return true;
		} else {
			triggerAlert("alert-warning", `Item [${itemName}] is not in your inventory`);
			return false;
		}
	}

	static inventory() {
		const itemObjList = Game.getPlayer().getInventory().getList();
		let outString = "";
		for (let index = 0; index < itemObjList.length; index++) {
			const itemObj = itemObjList[index];
			if (itemObj["quantity"] > 1) outString += `${itemObj["quantity"]} x `;
			outString += `[${itemObj["itemName"]}]`;
			if (index !== itemObjList.length - 1) outString += ", ";
		}
		if (outString !== "") {
			log(outString);
			return true;
		} else {
			triggerAlert("alert-warning", `Inventory is empty`);
			return false;
		}
	}

	static questlog(type) {
		const questlog = Game.getPlayer().getQuestLog();
		switch (type) {
			case "completed":
				questlog.logCompletedQuests();
				break;
			default:
				questlog.logActiveQuests();
				break;
		}
	}

	static talkto(mobName) {
		if (Game.getGameMode() !== GameMode.ADVENTURE) return false;
		const sceneMob = Game.getCurrentScene().getMob(mobName);
		const storyMob = Story.getMob(mobName);
		if (sceneMob.type === "npc" && sceneMob.stats.getStatus() === MobStatus.ALIVE && storyMob.hasOwnProperty("dialog") && storyMob["dialog"].length > 0) {
			Game.loadDialog(storyMob);
			Game.changeGameMode(GameMode.DIALOG);
			Game.getDialog().start();
			PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.TALKTO, mobName));
			return true;
		} else {
			log("You probably shouldn't talk to them, or they just have nothing to say.");
		}
	}

	static response(responseIndex) {
		let nextStatementId = Game.getDialog().getResponses().get(responseIndex);
		if (nextStatementId === undefined || nextStatementId === null) {
			triggerAlert("alert-warning", `Invalid response`);
			return false;
		} else {
			clearResponseClass(responseIndex);
			//if the called statement has no further responses then the conversation is over  
			if (!Game.getDialog().logStatement(nextStatementId)) this.bye();
			return true;
		}
	}

	static questHandIn(mobName, requiredItemObj) {
		const inv = Game.getPlayer().getInventory();
		const { type, rarity, itemName, quantity } = requiredItemObj;
		if (itemName !== "" && inv.hasItem(itemName)) {
			if (inv.removeItem(itemName, quantity, true)) {
				log(`You give /**${mobName}*\\ ${quantity} x [${itemName}]`);
				PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.QUEST_HAND_IN, mobName, itemName, quantity));
				return true;
			}
		} else if (type !== "" && inv.hasItemType(type)) {
			const removedItem = inv.removeItemType(type, rarity, quantity, true);
			if (removedItem) {
				log(`You give /**${mobName}*\\ ${quantity} x [${removedItem.itemName}]`);
				PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.QUEST_HAND_IN, mobName, `type:${type}:rarity:${rarity}`, quantity));
				return true;
			}
		}
		return false;
	}

	static bye() {
		if (Game.getGameMode() === GameMode.DIALOG) {
			Game.changeGameMode(GameMode.ADVENTURE);
			log(`You finish your conversation and walk away...`);
		}
	}

	static use(itemName, objectName) {
		if (itemName = "") {//handle using the object}


		}

		const objectFSM = Story.getObject(objectName)["fsm"];

		// check the fsm event list for a common code
		const inputCode = `use ${itemName}`;

		for (let i = 0; i < objectFSM.eventList.length; i++) {
			console.log(objectFSM.eventList);
		}



		//if there is one then look for the id in the trigger list

		//attempt to fire the transitions in order and then clos out the loop

		//broadcast the trigger that has been fired
		//so that other fms can listen to that


	}

	static stats() {
		const stats = Game.getPlayer().getStats();
		log("-----PLAYER Stats----");
		log(`Status: ${stats.getStatus()}`);
		stats.getResourceList().forEach(resource => {
			log(`${resource.getType().toUpperCase()}: ${resource.getCurrentValue()}/${resource.getMaxValue()}`);
		});
		let outString = "Buffs: ";
		stats.getBuffSet().forEach(buff => outString += `${buff} `);
		log(outString);
		outString = "Debuffs: ";
		stats.getDebuffSet().forEach(debuff => outString += `${debuff} `);
		log(outString);
		log(`Armour: ${stats.getArmourClass()}`);
		log(`Attack Bonus: ${stats.getAttackBonus()}`);
		log(`Initiative Bonus: ${stats.getInitiativeBonus()}`);
	}


	static async roll(rollString) {
		let { total, dice } = Dice.rollFromString(rollString);
		log(`/roll ${rollString} [${dice}] - total sum => ${total}`);
	}

	static async save() {
		Game.savePlayer();
		log(`/save ${Game.player}`);
	}

	static help(commandName = "") {
		if (commandName === "" || commandName === undefined) {
			CommandMap.forEach(list => {
				list.forEach(command => log(command));
			});

		} else {
			switch (commandName) {
				case "/help":
					log("The /help command lists all the commands that can be executed. You can also do /help [command] for more info on that specific command.");
					break;
				case "/roll":
					log("The /roll command lets you roll a number of certain sided dice to produce a sum of the results. Usage: [number of dice]d[number of sides].");
					break;
				case "/save":
					log("The /save command saves the current state of the game in your cookies or whatever.");
					break;
				case "inventory":
					log("The inventory command displays all the items that are in your character's backpack and equipped on your character.");
					break;
				case "stats":
					log("The stats command displays your character's current health-points, stamina and mana levels. A long with the current level and values for Strength, Dexterity and Wisdom.");
					break;
				case "path":
					log("Usage: path [north, east, south, west] or [defined Object], object will be described in the prompt and appear as an option when available. Moves the character to that destination if possible.");
					break;
				case "look":
					log("Usage: look [north, east, south, west] or [defined Object], object will be described in the prompt and appear as an option when available. The character is provided with information based on a perception check.");
					break;
				case "investigate":
					log("Usage: investigate [defined Object], object will be described in the prompt and appear as an option when available. Use on an object to learn more about it.");
					break;
				case "talkto":
					log("Usage: talkto [defined Person/Mob/Entity] they will be described in the prompt and appear as an option when available. Attempt to open a dialog with the chosen being.");
					break;
				case "pickup":
					log("Usage: pickup [defined Object], objects able to be picked up will appear as an option. Moves the object into the character's inventory");
					break;
				case "attack":
					log("Usage: attack [defined Person/Mob/Entity], they will be described in the prompt and appear as an option when available. This will enter the character and the chosen being into initiative, each take turns in rounds of combat, both can take actions which cost Stamina.");
					break;
				case "loot":
					log("Usage: loot [defined Person/Mob/Entity], they will be described in the prompt and appear as an option when available. Displays the items dropped by a creature on dead or contained in a chest");
					break;
				case "cast":
					log("Usage: cast [defined learned spell], this will cast a spell, given the character knows the spell and has enough Mana to cast it");
					break;
			}
		}
	}
}



