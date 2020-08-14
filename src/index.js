import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { loadCommandInput } from './component/commandInputComponent';
import { loadSuggestionBox } from './component/suggestionBoxComponent';
import { loadAdventureLog } from "./component/adventureLogComponent";
import { loadAlert } from "./component/alertComponent";

import { initCommandInput } from "./controller/commandInputController";
import { log, initAdventreLog } from "./controller/adventureLogController";
import { initAlert } from "./controller/alertController";
import { initSuggestionBox } from './controller/suggestionBoxController';
import { Player } from './game/player';
import { FileUtil } from './game/util/fileUtil';
import { JSONUtil } from './game/util/jsonUtil';
import { SpellMap } from './game/definitions';


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
  initAdventreLog();
  initAlert();

  //start of the game
  log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands. Use the [Tab] key to select available commands and then press [Enter] key or [Click] to autocomplete the phrase. You can also use [Up/Down] arrow keys to run previously entered commands.");

  const player = new Player("james", 21);

})();
