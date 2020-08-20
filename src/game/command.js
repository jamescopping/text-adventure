import { log } from "../controller/adventureLogController";
import { Dice } from "./dice";
import { game } from "./game";
import { Story } from "./story";
import { triggerAlert } from "../controller/alertController";


const commandList = ['/roll', '/help', '/save', 'inventory', 'stats', 'path', 'look', 'investigate', 'talkto', 'pickup', 'attack', 'loot', 'cast', 'drop', 'use'].sort();
export const CommandSet = new Set([...commandList]);

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
        log(game.currentScene.getDescription());
    }

    static path(direction) {
        game.changeScene(direction);
    }

    static pickup(itemName) {
        //TODO remove item from the scene
        if (itemName !== "") {
            let sceneItem = game.getCurrentScene().pickupItem(itemName);
            if (sceneItem !== null) {
                game.getPlayer().pickupItem(sceneItem);
                return true;
            } else {
                triggerAlert("warning", `Item [${itemName}] does not exist in this scene`);
                return false;
            }
        }
    }

    static drop(itemName) {
        let item = game.getPlayer().getInventory().removeItem(itemName);
        if (item !== null) {
            game.getCurrentScene().getItems().push(itemName);
            log(`Item [${itemName}] removed from inventory`);
            return true;
        } else {
            log(`Item [${itemName}] can't be removed from your inventory`);
        }
        return false;
    }

    static investigate(itemName) {
        if (game.getPlayer().getInventory().hasItem(itemName)) {
            let item = Story.getItemMap().get(itemName);
            log(item["description"]);
        }
    }

    static inventory() {
        const list = game.getPlayer().getInventory().getList().sort();
        log(`Inventory: ${list}`);
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
            CommandSet.forEach(element => {
                log(`${element} `);
            });
        } else {
            //"/help",, "/roll" "/save", "inventory", "stats", "goto", "look", "investigate", "talkto", "pickup", "attack", "loot", "cast"
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



