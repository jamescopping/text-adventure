import { log, clearResponseClass, clearPathClass } from "../controller/adventureLogController";
import { Dice } from "./dice";
import { game, GameMode } from "./game";
import { Story } from "./story";
import { triggerAlert } from "../controller/alertController";

const adventureCommandList = ['/roll', '/help', '/save', 'inventory', 'stats', 'path', 'look', 'investigate', 'talkto', 'pickup', 'attack', 'loot', 'cast', 'drop', 'use'].sort();
const dialogCommandList = ['bye', 'response'].sort();
const combatCommandList = ['flee', 'attack', 'cast', 'use'].sort();
export const CommandMap = new Map();

CommandMap.set(GameMode.ADVENTURE, adventureCommandList);
CommandMap.set(GameMode.DIALOG, dialogCommandList);
CommandMap.set(GameMode.COMBAT, combatCommandList);

export class Command {

    constructor(string) {
        let split = Command.splitCommand(string);
        this.action = split.action;
        this.operand = (split.operand === undefined) ? "" : split.operand;
    }

    toString() { return `${this.action} ${(this.operand === "") ? "" : this.operand}`; }

    static splitCommand(string) {
        string = string.toLowerCase();
        return { action: string.split(" ")[0], operand: string.split(" ")[1] };
    }

    static look() {
        log(`You look around the ${game.getCurrentScene().getName()} and you find...`);
        const sceneItems = game.getCurrentScene().getItems();
        if (sceneItems === undefined || sceneItems.length === 0) {
            log("nothing...");
        } else {
            sceneItems.forEach(itemObj => {
                let outString = "";
                if (itemObj["quantity"] > 1) outString += `${itemObj["quantity"]} x `;
                outString += `[*${itemObj["name"]}*] ${itemObj["description"]}`;
                log(outString);
            });
        }
    }

    static path(direction) {
        if (direction !== "") {
            if (game.changeScene(direction)) {
                clearPathClass(direction);
                log(`You chose path ${direction}`);
                game.getCurrentScene().init();
            } else {
                triggerAlert("alert-warning", `<strong>Path ${direction}</strong> not found`);
            }
        }
    }

    static pickup(itemName) {
        //TODO remove item from the scene
        if (itemName !== "") {
            let sceneItem = game.getCurrentScene().pickupItem(itemName);
            if (sceneItem !== null) {
                game.getPlayer().pickupItem(sceneItem);
                return true;
            } else {
                triggerAlert("alert-warning", `Item [${itemName}] does not exist in this scene`);
                return false;
            }
        }
    }

    static drop(itemName) {
        if (itemName === "") return false;
        let itemObj = game.getPlayer().getInventory().removeItem(itemName);
        if (itemObj !== null) {
            game.getCurrentScene().getItems().push({ name: itemObj["name"], quantity: itemObj["quantity"], description: "dropped by player" });
            log(`Item [${itemObj["name"]}] x (${itemObj["quantity"]}) dropped from inventory`);
            return true;
        } else {
            triggerAlert("alert-warning", `Item [${itemObj["name"]}] can't be dropped from your inventory`);
            return false;
        }

    }

    static investigate(itemName) {
        if (game.getPlayer().getInventory().hasItem(itemName)) {
            let item = Story.getItemMap().get(itemName);
            log(`You investigate [${item["name"]}]: ${item["description"]}`);
            return true;
        } else {
            triggerAlert("alert-warning", `Item [${itemName}] is not in your inventory`);
            return false;
        }
    }

    static inventory() {
        const itemObjList = game.getPlayer().getInventory().getList();
        let outString = "";
        for (let index = 0; index < itemObjList.length; index++) {
            const itemObj = itemObjList[index];
            if (itemObj["quantity"] > 1) outString += `${itemObj["quantity"]} x `;
            outString += `[${itemObj["name"]}]`;
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

    static talkto(mob) {
        if (game.getCurrentScene().getMobs().includes(mob)) {
            const foundMob = Story.getMobMap().get(mob);
            if (foundMob["type"] === "npc") {
                game.loadDialog(foundMob);
                game.changeGameMode(GameMode.DIALOG);
                game.getDialog().start();
            } else {
                log("You probably shouldn't talk to them");
            }
        }
    }

    static response(responseIndex) {
        let nextStatementId = game.getDialog().getResponses().get(responseIndex);
        if (nextStatementId === undefined || nextStatementId === null) {
            triggerAlert("alert-warning", `Invalid response`);
            return false;
        } else {
            clearResponseClass(responseIndex);
            return game.getDialog().logStatement(nextStatementId);
        }
    }

    static bye() {
        game.changeGameMode(GameMode.ADVENTURE);
        log(`You finish your conversation and walk away...`);
    }

    static async roll(rollString) {
        let { total, dice } = await Dice.rollFromString(rollString);
        log(`/roll ${rollString} [${dice}] - total sum => ${total}`);
    }

    static async save() {
        game.savePlayer();
        log(`/save ${game.player}`);
    }

    static help(commandName = "") {
        if (commandName === "" || commandName === undefined) {
            CommandMap.forEach(list => {
                console.log(list);
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



