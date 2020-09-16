import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import { loadCommandInput } from "./component/commandInputComponent";
import { loadSuggestionBox } from "./component/suggestionBoxComponent";
import { loadAdventureLog } from "./component/adventureLogComponent";
import { loadAlert } from "./component/alertComponent";

import { initCommandInput } from "./controller/commandInputController";
import { initAdventureLog, log } from "./controller/adventureLogController";
import { initAlert } from "./controller/alertController";
import { initSuggestionBox } from "./controller/suggestionBoxController";
import { Game } from "./adventureGame/game";

const buildPage = () => {
	const main = document.createElement("main");
	main.setAttribute("role", "main");
	main.className = "bg-dark p-3";
	const container = document.createElement("div");
	container.className = "full-height";

	container.appendChild(loadAdventureLog());
	container.appendChild(loadCommandInput());
	container.appendChild(loadSuggestionBox());
	container.appendChild(loadAlert());
	main.appendChild(container);

	return main;
}

(() => {
	document.body.appendChild(buildPage());

	initSuggestionBox();
	initCommandInput();
	initAdventureLog();
	initAlert();
	log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands. You can click text that is highlighted and a corresponding command will be executed. Use the TAB key to select available commands and then press ENTER key or CLICK to autocomplete the phrase. You can also use UP/DOWN arrow keys to run previously entered commands.");
	Game.start();
})();
