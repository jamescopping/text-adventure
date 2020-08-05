import { log } from "../controller/adventureLogController";
import { commandList } from "./definitions";
import { Dice } from "./dice";

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

    static async roll(rollString) {
        let { total, dice } = await Dice.rollFromString(rollString);
        log(`/roll ${rollString} [${dice}] - total sum => ${total}`);

    }

    static help(commandName = "") {
        if (commandName === "" || commandName === undefined) {
            commandList.forEach(element => {
                log(`${element} `);
            });
        } else {
            //"/help",, "/roll" "/save", "inventory", "stats", "goto", "look", "investigate", "talkto", "pickup", "attack", "loot", "cast"
            switch (commandName) {
                case "/help":
                    log("The /help command lists all the commands that can be executed. You can also do /help [command] for more info on that specific command.");
                    break;
                case "/roll":
                    log("The /roll command lets you roll a number of certain sided dice to produce a sum of the results.");
                    break;
                case "/save":
                    log("The /save command saves the current state of the game in your cookies or whatever.");
                    break;
                case "inventory":
                    log("The inventory command displays all the items that are in your chacater's backpack and equiped on your character.");
                    break;
                case "stats":
                    log("The stats command displays your character's current Healthpoints, Stamina and Mana levels. A long with the current level and values for Strength, Dexterity and Wisdom.");
                    break;
                case "goto":
                    log("Usage: goto [north, east, south, west] or [defined Object], object will be described in the promt and appear as an option when available. Moves the character to that destination if possiable.");
                    break;
                case "look":
                    log("Usage: look [north, east, south, west] or [defined Object], object will be described in the promt and appear as an option when available. The character is provided with infomation based on a perception check.");
                    break;
                case "investigate":
                    log("Usage: investigate [defined Object], object will be described in the promt and appear as an option when available. Use on an object to learn more about it.");
                    break;
                case "talkto":
                    log("Usage: talkto [defined Person/Mob/Entity] they will be described in the promt and appear as an option when available. Attempt to open a dislog with the chosen being.");
                    break;
                case "pickup":
                    log("Usage: pickup [defined Object], objects able to be picked up will appear as an option. Moves the object into the chacters inventory");
                    break;
                case "attack":
                    log("Usage: attack [defined Person/Mob/Entity], they will be described in the promt and appear as an option when available. This will enter the character and the chosen being into initiative, each take turns in rounds of combat, both can take actions which cost Stamina.");
                    break;
                case "loot":
                    log("Usage: loot [defined Person/Mob/Entity], they will be described in the promt and appear as an option when available. Displays the items dropped by a creature on dead or contained in a chest");
                    break;
                case "cast":
                    log("Usage: cast [defined learned spell], this will cast a spell, given the character knows the spell and has enough Mana to cast it");
                    break;
            }
        }
    }

}



