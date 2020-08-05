import { updateContentSuggestionBox, hideSuggestionBox } from "../controller/suggestionBoxController";
import { log } from "../controller/adventureLogController";
import { triggerAlert } from "../controller/alertController";

import { Command } from "../game/command";
import { commandList, OperandTypeDictionary, SpellList, ItemList } from "../game/definitions";
import { prevCommand } from "../model/previousCommand";
import { suggestion } from "../model/suggestion";
import { operand } from "../model/operand";
import { alertText } from "./alertController";

export let commandTextWidth, commandInput;
let commandSubmit;

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
            (keycode == 32) || // spacebar & return key(s) (if you want to allow carriage returns)
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
            specialKeyInput();
        }
    });
}

const setInvalidClass = state => { (state) ? commandInput.classList.add("is-invalid") : commandInput.classList.remove("is-invalid"); }

/*  
    Function handles special key input (anything that is not a normal chacacter)
    repllicates the functionally of an input box, like pressing enter, deleting,
    selecting, using arrows to view previous commands. Tab to auto commplete from
    suggestion box pupup.
*/
const specialKeyInput = () => {
    let command;
    hideSuggestionBox();
    switch (event.key) {
        case "Enter":
            submitCommandInput();
            break;
        case "ArrowUp":
            commandInput.value = prevCommand.prev().toString();
            break;
        case "ArrowDown":
            commandInput.value = prevCommand.next().toString();
            break;
        case "ArrowRight":
            console.log("arrow right");
            console.log(getCaretPosition(commandInput));
            break;
        case "ArrowLeft":
            console.log("arrow left");
            console.log(getCaretPosition(commandInput));
            break;
        case "Tab":
            console.log("tab");




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
        setInvalidClass(false);
        suggestion.setList([]);
        operand.setProperty("");
        operand.setType(OperandTypeDictionary.COMMAND);
        if (hasSpace(value)) {  //if there is a space in the string then do checks on the second word
            let command = new Command(value);
            if (commandList.includes(command.action)) {
                if (command.action === "/help") {
                    operand.setType(OperandTypeDictionary.COMMAND);
                    suggestion.populateList(commandList, command.operand);
                } else if (command.action === "/roll") {
                    suggestion.getList().push("[number of dice]d[number of sides]");
                } else {
                    let property = "";
                    switch (command.action) {
                        case "cast":
                            operand.setType(OperandTypeDictionary.SPELL);
                            operand.setList(SpellList);
                            operand.setProperty("name");
                            break;
                        case "pickup":
                            operand.setType(OperandTypeDictionary.ITEM);
                            operand.setList(ItemList);
                            operand.setProperty("name");
                            break;
                    }
                    suggestion.populateList(operand.getList(), command.operand, operand.getProperty());
                }
            }
        } else {
            suggestion.populateList(commandList, value);
        }
        if (suggestion.generateError()) setInvalidClass(true);
        commandTextWidth.textContent = value;
        updateContentSuggestionBox();
    } else {
        hideSuggestionBox();
    }
}

const hasSpace = string => string.includes(" ");

const validateCommand = command => {
    let save = false;
    switch (command.action) {
        case "":
            triggerAlert("alert-danger", "<strong>Warning! </strong> You have to enter something in the input box!");
            break;
        case "/help":
            Command.help(command.operand);
            save = true;
            break;
        case "/roll":
            Command.roll(command.operand);
            save = true;
            break;
        default:
            log(`${command.action} ${command.operand} [this command is yet to be implemented!]`);
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

const getCaretPosition = el => {
    var caretOffset = 0, sel;
    if (typeof window.getSelection !== "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var selected = range.toString().length;
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(el);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length - selected;
    }
    return caretOffset;
}