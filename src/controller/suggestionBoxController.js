import { commandTextWidth, commandInput, autocompleteFromSelection } from "../controller/commandInputController";

import { suggestion } from "../model/suggestion";
import { operand } from "../model/operand";

let suggestionBox;

export const initSuggestionBox = () => {
    suggestionBox = findSuggestionBoxElement();
    suggestionBox.addEventListener("click", event => {
        removeSelectedClass();
        if (event.target.classList.contains("no-select")) return;
        event.target.classList.add("selected");
        if (isSuggestionSelected()) {
            autocompleteFromSelection();
        }
    });

}

const findSuggestionBoxElement = () => document.getElementById("suggestion-box");
export const hideSuggestionBox = () => suggestionBox.style.display = "none";
export const showSuggestionBox = () => suggestionBox.style.display = "block";

export const updateContentSuggestionBox = () => {
    suggestionBox.innerHTML = "";
    if (!suggestion.isError()) {
        suggestion.list.forEach(element => {
            const suggestionItem = document.createElement("p");
            suggestionItem.innerHTML = (operand.isPropertySet()) ? element[operand.getProperty()] : element;
            suggestionBox.appendChild(suggestionItem);
        });
    } else {
        const suggestionError = document.createElement("p");
        suggestionError.className = "bg-danger no-select";
        suggestionError.innerHTML = suggestion.error;
        suggestionBox.appendChild(suggestionError);
    }
    updatePositionSuggestionBox();
}

const updatePositionSuggestionBox = () => {
    showSuggestionBox();
    let topOffset = commandInput.getBoundingClientRect().top;
    let leftOffset = commandInput.getBoundingClientRect().left;
    let suggestionBoxHeight = suggestionBox.getBoundingClientRect().height;
    suggestionBox.style.top = `${topOffset - suggestionBoxHeight - 1}px`;
    suggestionBox.style.left = `${leftOffset + 25 + commandTextWidth.clientWidth}px`;
}

export const selectNextSuggestion = () => {
    if (suggestion.isListEmpty()) return;
    if (suggestion.index === -1) {
        suggestion.index = suggestion.getList().length - 1;
    } else {
        suggestion.index = (suggestion.index === 0) ? suggestion.getList().length - 1 : suggestion.index - 1;
    }
    removeSelectedClass();
    let nextSelected = suggestionBox.children[suggestion.index];
    nextSelected.classList.add("selected");
}

export const isSuggestionSelected = () => {
    let element = document.querySelector("#suggestion-box .selected");
    return element !== null && element !== undefined;
}

export const getSelectedSuggestionText = () => document.querySelector("#suggestion-box .selected").innerText;

const removeSelectedClass = () => {
    document.querySelectorAll(".selected").forEach(element => {
        element.classList.remove("selected");
    });
}