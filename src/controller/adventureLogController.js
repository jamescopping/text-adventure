
import { game } from "../game/game";
import { commandInput, commandSubmit } from "./commandInputController";

let adventureLog;

export const initAdventureLog = () => {
	adventureLog = findAdventureLogElement();

	adventureLog.addEventListener('click', event => {
		let element = event.target;
		if (element.tagName === "SPAN" && element.className.includes("scene-item-text")) {
			commandInput.value = `pickup ${element.textContent.substring(2, element.textContent.length - 2)}`;
			commandSubmit.click();
		} else if (element.tagName === "SPAN" && element.className.includes("inv-item-text")) {
			commandInput.value = `investigate ${element.textContent.substring(1, element.textContent.length - 1)}`;
			commandSubmit.click();
		} else if (element.tagName === "SPAN" && element.className.includes("response-text")) {
			game.getDialog().setResponses(getResponseMap());
			commandInput.value = `response ${element.textContent.substring(0, element.textContent.indexOf("."))}`;
			commandSubmit.click();
		} else if (element.tagName === "SPAN" && element.className.includes("path-text")) {
			commandInput.value = `path ${element.textContent.substring(2, element.textContent.length - 2)}`;
			commandSubmit.click();
		} else if (element.tagName === "SPAN" && element.className.includes("mob-text")) {
			commandInput.value = `talkto ${element.textContent.substring(2, element.textContent.length - 2)}`;
			commandSubmit.click();
		}
	});
};

const findAdventureLogElement = () => document.getElementById("adventure-log");

const generateLog = text => {

	//item text styling
	text = text.replace(/(\[(?=[^\*]))/gm, `<span class="inv-item-text font-weight-bold text-nowrap">[`);
	text = text.replace(/\]/gm, `]</span>`);

	text = text.replace(/(\[\*)/gm, `<span class="scene-item-text font-weight-bold text-nowrap">[*`);
	text = text.replace(/(\*\])/gm, `*]</span>`);

	text = text.replace(/(\/\*)/gm, `<span class="mob-text font-weight-bold text-nowrap">/`);
	text = text.replace(/(\*\\)/gm, `*\\</span>`);

	text = text.replace(/\(/gm, `<span class="object-text font-weight-bold text-nowrap">(`);
	text = text.replace(/\)/gm, `)</span>`);

	text = text.replace(/(\<\-)/gm, `<span class="path-text font-weight-bold text-nowrap">\<-`);
	text = text.replace(/(\-\>)/gm, `-\></span>`);

	text = text.replace(/(accept quest)/gim, `<span class="accept-quest-text">Accept Quest</span>`);

	const log = document.createElement("p");
	log.className = "text-monospace text-break lead";
	log.innerHTML += `<strong class="font-weight-bolder">\> </strong>`;
	log.innerHTML += text;
	return log;
};

const insertIntoAdventureLog = text => {
	adventureLog.appendChild(generateLog(text));
	adventureLog.scrollTop = adventureLog.scrollHeight;
};

export const log = text => insertIntoAdventureLog(text);

export const getResponseMap = () => {
	const responseList = document.querySelectorAll("span.response-text");
	const responseMap = new Map();
	responseList.forEach((element, index) => {
		responseMap.set((index + 1).toString(), element.getAttribute("data-nextStatementId").toString());
	});
	return responseMap;
}

export const clearResponseClass = selectedIndex => {
	document.querySelectorAll("span.response-text").forEach((element, index) => {
		if (parseInt(selectedIndex) === index + 1) {
			element.className = element.className.replace(/\bresponse-text\b/g, "selected-response");
		} else {
			element.className = element.className.replace(/\bresponse-text\b/g, "");
		}
	});
}

export const clearPathClass = (direction) => {
	document.querySelectorAll("span.path-text").forEach(element => {
		if (direction === element.textContent.substring(2, element.textContent.length - 2)) {
			element.className = element.className.replace(/\bpath-text\b/g, "selected-path");
		} else {
			element.className = element.className.replace(/\bpath-text\b/g, "");
		}
	});
}
