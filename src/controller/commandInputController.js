import { updateContentSuggestionBox, hideSuggestionBox } from "../controller/suggestionBoxController";
import { log } from "../controller/adventureLogController";
import { triggerAlert } from "../controller/alertController";

import { Command } from "../game/command";
import { commandList } from "../game/definitions";
import { prevCommand } from "../model/previousCommand";
import { suggestion } from "../model/suggestion";
import { alertText } from "./alertController";

export let commandTextWidth, commandInput;
let commandSubmit;

export function initCommandInput() {
    commandInput = findCommandInputElement();
    commandSubmit = findCommandSubmitElement();
    commandTextWidth = findCommandTextWidthElement();
    bindEventListeners();
}

function findCommandInputElement() {
    return document.getElementById("command-input");
}

function findCommandSubmitElement() {
    return document.getElementById("command-submit");
}

export function findCommandTextWidthElement() {
    return document.getElementById("command-text-width");
}

function getCaretPosition(el) {
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

function bindEventListeners() {
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

    commandInput.addEventListener('keydown', (event) => {
        event.preventDefault();
        if (validKeys(event.keyCode)) {
            commandInput.value += event.key;
            handleTextCommandInput(commandInput.value);
        } else {
            specialKeyInput();
        }
    });
}

/*  
    Function handles special key input (anything that is not a normal chacacter)
    repllicates the functionally of an input box, like pressing enter, deleting,
    selecting, using arrows to view previous commands. Tab to auto commplete from
    suggestion box pupup.
*/
function specialKeyInput() {
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

function handleTextCommandInput(value) {
    if (value !== "") {
        commandInput.classList.remove("is-invalid");
        let itemDescription = "{command}";
        if (value.includes(" ")) {
            let command = new Command(value);
            if (commandList.includes(command.action)) {
                switch (command.action) {
                    case "/help":
                        suggestion.populateList(commandList, command.operand);
                        break;
                }
                if (suggestion.isListEmpty()) {
                    suggestion.error = `[Error] No such ${itemDescription}`;
                }
            } else {
                commandInput.classList.add("is-invalid");
                suggestion.error = "[Error] Command does NOT exist"
            }
        } else {
            suggestion.populateList(commandList, value);
            if (suggestion.isListEmpty()) {
                suggestion.error = "[Error] Command does NOT exist"
            }
        }
        commandTextWidth.textContent = value;
        updateContentSuggestionBox();
    } else {
        hideSuggestionBox();
    }
}

function validateCommand(command) {
    let save = false;
    switch (command.action) {
        case "":
            triggerAlert("alert-danger", "<strong>Warning! </strong> You have to enter something in the input box!");
            break;
        case "/help":
            Command.help(command.operand);
            save = true;
            break;
        default:
            log(`${command.action} ${command.operand} [this command is yet to be implemented!]`);
            break;
    }
    if (save) saveCommand(command);
}

function submitCommandInput() {
    if (!suggestion.isError()) {
        validateCommand(new Command(commandInput.value));
        commandInput.value = "";
        hideSuggestionBox();
    } else {
        commandInput.classList.add("is-invalid");
    }
}

function saveCommand(command) {
    prevCommand.addCommand(command);
}