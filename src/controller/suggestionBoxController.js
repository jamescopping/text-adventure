import { commandTextWidth, commandInput } from "../controller/commandInputController";

import { suggestion } from "../model/suggestion";

let suggestionBox;

export function initSuggestionBox() {
    suggestionBox = findSuggestionBoxElement();
}

function findSuggestionBoxElement() {
    return document.getElementById("suggestion-box");
}

export function hideSuggestionBox() {
    suggestionBox.style.display = "none";
}

export function showSuggestionBox() {
    suggestionBox.style.display = "block";
}


export function updateContentSuggestionBox() {
    suggestionBox.innerHTML = "";
    if (!suggestion.isListEmpty()) {
        suggestion.list.forEach(element => {
            const suggestionItem = document.createElement("p");
            suggestionItem.className = "dropdown-item";
            suggestionItem.innerHTML = element;
            suggestionBox.appendChild(suggestionItem);
        });
    } else if (suggestion.error !== "") {
        const suggestionError = document.createElement("p");
        suggestionError.className = "bg-danger";
        suggestionError.innerHTML = suggestion.error;
        suggestionBox.appendChild(suggestionError);
    }
    updatePositionSuggestionBox();
}

function updatePositionSuggestionBox() {
    showSuggestionBox();
    let topOffset = commandInput.getBoundingClientRect().top;
    let leftOffset = commandInput.getBoundingClientRect().left;
    let suggestionBoxHeight = suggestionBox.getBoundingClientRect().height;
    suggestionBox.style.top = `${topOffset - suggestionBoxHeight - 1}px`;
    suggestionBox.style.left = `${leftOffset + 25 + commandTextWidth.clientWidth}px`;
}