import { updateContentSuggestionBox, hideSuggestionBox, selectNextSuggestion, isSuggestionSelected, getSelectedSuggestionText } from "../controller/suggestionBoxController";
import { log } from "../controller/adventureLogController";
import { triggerAlert } from "../controller/alertController";

import { Command, CommandMap } from "../adventureGame/command";
import { OperandList } from "../model/operand";
import { prevCommand } from "../model/previousCommand";
import { suggestion } from "../model/suggestion";
import { operand } from "../model/operand";
import { Game } from "../adventureGame/game";

export let commandTextWidth, commandInput, commandSubmit;

export const initCommandInput = () => {
	commandInput = findCommandInputElement();
	commandSubmit = findCommandSubmitElement();
	commandTextWidth = findCommandTextWidthElement();
	bindEventListeners();
}

const findCommandInputElement = () => document.getElementById("command-input");
const findCommandSubmitElement = () => document.getElementById("command-submit");
export const findCommandTextWidthElement = () => document.getElementById("command-text-width");


const bindEventListeners = () => {
	const validKeys = (keycode) => {
		return (keycode > 47 && keycode < 58) || // number keys
			//(keycode == 32) || // space-bar & return key(s) (if you want to allow carriage returns)
			(keycode > 64 && keycode < 91) || // letter keys
			(keycode > 95 && keycode < 112) || // numpad keys
			(keycode > 185 && keycode < 193) || // ;=,-./` (in order)
			(keycode > 218 && keycode < 223); // [\]' (in order)
	}

	/*--EVENTS--*/
	commandSubmit.onclick = submitCommandInput;

	commandInput.addEventListener('keydown', event => {
		event.preventDefault();
		if (validKeys(event.keyCode)) {
			commandInput.value += event.key;
			handleTextCommandInput(commandInput.value);
		} else {
			specialKeyInput(event);
		}
	});
}

/*  
	Function handles special key input (anything that is not a normal character)
	replicates the functionally of an input box, like pressing enter, deleting,
	selecting, using arrows to view previous commands. Tab to auto complete from
	suggestion box popup.
*/
const specialKeyInput = event => {
	const [selStart, selEnd] = getCaretPosition(commandInput);

	switch (event.key) {
		case "Escape":
			hideSuggestionBox();
			break;
		case " ":
			if (isSuggestionSelected()) {
				autocompleteFromSelection();
			} else {
				commandInput.value += " ";
				handleTextCommandInput(commandInput.value);
			}
			break;
		case "Enter":
			isSuggestionSelected() ? autocompleteFromSelection() : submitCommandInput();
			break;
		case "ArrowUp":
			commandInput.value = prevCommand.prev().toString();
			handleTextCommandInput(commandInput.value);
			break;
		case "ArrowDown":
			commandInput.value = prevCommand.next().toString();
			handleTextCommandInput(commandInput.value);
			break;
		case "Tab":
			if (commandInput.value === "") {
				suggestion.setList(CommandMap.get(Game.getGameMode()));
				commandTextWidth.textContent = commandInput.value;
				updateContentSuggestionBox();
			}
			selectNextSuggestion();
			break;
		case "Backspace":
			let value = commandInput.value;
			if (value.length > 0) {
				commandInput.value = value.substring(0, value.length - 1);
				handleTextCommandInput(commandInput.value);
			}
			break;
	}
}

const handleTextCommandInput = value => {
	if (value !== "") {
		resetToDefaults();
		if (hasSpace(value)) {  //if there is a space in the string then do checks on the second word
			let command = new Command(value);
			if (CommandMap.get(Game.getGameMode()).includes(command.action)) {
				if (command.action === "/help") {
					operand.setType(OperandList.COMMAND);
					suggestion.populateList(operand.getList(), command.operand[command.operand.length - 1]);
				} else if (command.action === "/roll") {
					suggestion.getList().push("!Usage: [number]d[dice type]");
				} else if (command.action === "questlog") {
					suggestion.getList().push(["active", "completed"]);
				} else {
					switch (command.action) {
						case "cast":
							operand.setType(OperandList.KNOWN_SPELL);
							break;
						case "pickup":
							operand.setType(OperandList.ITEM);
							break;
						case "drop":
							operand.setType(OperandList.INVENTORY);
							break;
						case "investigate":
							operand.setType(OperandList.INVENTORY);
							break;
						case "use":
							console.log(command.operand);
							if (command.operand.length > 1) {
								operand.setType(OperandList.OBJECT);
							} else {
								operand.setType(OperandList.INVENTORY);
							}
							break;
						case "attack":
							operand.setType(OperandList.MOB);
							break;
						case "talkto":
							operand.setType(OperandList.MOB);
							break;
						case "loot":
							operand.setType(OperandList.MOB);
							break;
						case "path":
							operand.setType(OperandList.PATH);
							break;
						case "response":
							operand.setType(OperandList.RESPONSE);
							break;
						case "look":
							operand.setType(OperandList.LOOK);
							break;
					}
					suggestion.populateList(operand.getList(), command.operand[command.operand.length - 1]);
				}
			}
		} else {
			operand.setType(OperandList.COMMAND);
			suggestion.populateList(operand.getList(), value);
		}
		if (suggestion.generateError()) setInvalidClass(true);
		commandTextWidth.textContent = value;
		updateContentSuggestionBox();
	} else {
		hideSuggestionBox();
	}
}

export const autocompleteFromSelection = () => {
	let autocompleteText = getSelectedSuggestionText();
	if (!hasSpace(commandInput.value)) {
		commandInput.value = autocompleteText;
	} else {
		console.log(autocompleteText);
		let command = new Command(commandInput.value);
		command.operand[command.operand.length - 1] = autocompleteText;
		commandInput.value = command.toString();
	}
	handleTextCommandInput(commandInput.value);
}

const validateCommand = command => {
	let save = false;
	switch (command.action) {
		case "":
			triggerAlert("alert-danger", "<strong>Warning! </strong> You have to enter something in the input box!");
			break;
		case "/help":
			Command.help(command.operand[0]);
			save = true;
			break;
		case "/roll":
			Command.roll(command.operand[0]);
			save = true;
			break;
		case "/save":
			Command.save();
			save = true;
			break;
		case "look":
			Command.look(command.operand[0]);
			save = true;
			break;
		case "path":
			Command.path(command.operand[0]);
			save = true;
			break;
		case "pickup":
			if (Command.pickup(command.operand[0])) save = true;
			break;
		case "drop":
			if (Command.drop(command.operand[0])) save = true;
			break;
		case "investigate":
			Command.investigate(command.operand[0]);
			save = true;
			break;
		case "inventory":
			if (Command.inventory()) save = true;
			break;
		case "talkto":
			if (Command.talkto(command.operand[0])) save = true;
			break;
		case "bye":
			if (Command.bye()) save = true;
			break;
		case "response":
			if (Command.response(command.operand[0])) save = true;
			break;
		case "questlog":
			Command.questlog(command.operand[0]);
			save = true;
			break;
		case "stats":
			Command.stats();
			save = true;
			break;
		case "use":
			Command.use(command.operand[0], command.operand[1]);
			save = true;
			break;
		default:
			log(`${command.action} ${command.operand[0]} !this command is yet to be implemented!`);
			save = true;
			break;
	}
	if (save) saveCommand(command);
}

const submitCommandInput = () => {
	if (!suggestion.isError()) {
		validateCommand(new Command(commandInput.value));
		commandInput.value = "";
		hideSuggestionBox();
	} else {
		commandInput.classList.add("is-invalid");
	}
}

const saveCommand = command => {
	prevCommand.addCommand(command);
}

const resetToDefaults = () => {
	setInvalidClass(false);
	operand.setType();
	suggestion.setList([]);
	suggestion.index = -1;
}

const getCaretPosition = el => {
	let startPos = el.selectionStart;
	let endPos = el.selectionEnd;
	return [startPos, endPos];
}

const hasSpace = string => string.includes(" ");
const setInvalidClass = state => { (state) ? commandInput.classList.add("is-invalid") : commandInput.classList.remove("is-invalid"); }