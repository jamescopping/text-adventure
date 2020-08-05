import { commandTextWidth, commandInput } from "../controller/commandInputController";

import { suggestion } from "../model/suggestion";
import { operand } from "../model/operand";

let suggestionBox;

export const initSuggestionBox = () => {
    suggestionBox = findSuggestionBoxElement();
}

const findSuggestionBoxElement = () => document.getElementById("suggestion-box");
export const hideSuggestionBox = () => suggestionBox.style.display = "none";
export const showSuggestionBox = () => suggestionBox.style.display = "block";

export const updateContentSuggestionBox = () => {
    suggestionBox.innerHTML = "";
    if (!suggestion.isError()) {
        suggestion.list.forEach(element => {
            const suggestionItem = document.createElement("p");
            suggestionItem.className = "dropdown-item";
            suggestionItem.innerHTML = (operand.isPropertySet()) ? element[operand.getProperty()] : element;
            suggestionBox.appendChild(suggestionItem);
        });
    } else {
        const suggestionError = document.createElement("p");
        suggestionError.className = "bg-danger";
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