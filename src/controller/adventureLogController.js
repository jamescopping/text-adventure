
import { Game } from "../adventureGame/game";
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
			Game.getDialog().setResponses(getResponseMap());
			commandInput.value = `response ${element.textContent.substring(0, element.textContent.indexOf("."))}`;
			commandSubmit.click();
		} else if (element.tagName === "SPAN" && element.className.includes("path-text")) {
			commandInput.value = `path ${element.textContent.substring(2, element.textContent.length - 2)}`;
			commandSubmit.click();
		} else if (element.tagName === "SPAN" && element.className.includes("mob-text")) {
			commandInput.value = `talkto ${element.textContent.substring(2, element.textContent.length - 2)}`;
			commandSubmit.click();
		} else if (element.tagName === "SPAN" && element.className.includes("combat-option")) {
			Game.getCombat().playerCombatOptionSelected(element.textContent);
		}
	});
};

export const executeCommand = command => {
	commandInput.value = command;
	commandSubmit.click();
}

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

	text = text.replace(/(accept quest)/gim, `<span class="active-quest-text">Accept Quest</span>`);
	text = text.replace(/(complete quest)/gim, `<span class="completed-quest-text">Complete Quest</span>`);

	const log = document.createElement("p");
	log.className = "text-monospace text-break lead";
	log.innerHTML += `<strong class="font-weight-bolder">\> </strong>`;
	log.innerHTML += text;
	log.style.opacity = '0';
	fadeIn(log, 500);
	return log;
};

export const fadeIn = (element, duration) => {
	(function increment(value = 0) {
		element.style.opacity = String(value);
		if (element.style.opacity !== '1') {
			setTimeout(() => {
				increment(value + 0.1);
			}, duration / 10);
		}
	})();
};

export const fadeOut = (element, duration) => {
	(function decrement() {
		(element.style.opacity -= 0.1) < 0 ? element.style.display = 'none' : setTimeout(() => {
			decrement();
		}, duration / 10);
	})();
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
