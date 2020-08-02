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

function buildPage() {
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


  //let entityList = ["barry", "jonny", "harry", "james", "billy", "duck", "bluekey"];


  //start of the game
  log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands.");


})();
