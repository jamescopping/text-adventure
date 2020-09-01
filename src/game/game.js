import { log } from "../controller/adventureLogController"
import { Player, PlayerEvent, PlayerAction } from "./player";
import { JSONUtil } from "./util/jsonUtil";
import { Story } from "./story";
import { Scene } from "./scene";
import { Dialog } from "./dialog";

export const GameMode = {
	ADVENTURE: "adventure",
	COMBAT: "combat",
	DIALOG: "dialog"
}

export class Game {
	constructor() {
		Story.loadStoryAssetsFromXML("./story/testStory.xml");
		this.mode = GameMode.ADVENTURE;
		this.player = new Player();
		this.currentScene = new Scene();
		this.visitedScenes = new Map();
		this.dialog = new Dialog();
		this.loadPlayer();
		this.currentScene.loadScene();
	}

	start() {
		log("Game started");
		log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands. You can click text that is highlighted and a corresponding command will be executed. Use the TAB key to select available commands and then press ENTER key or CLICK to autocomplete the phrase. You can also use UP/DOWN arrow keys to run previously entered commands.");
		this.currentScene.init();
		PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.START));
	}

	changeScene(sceneName) {
		this.currentScene.saveSceneState();
		this.currentScene.loadScene(sceneName);
		return true;
	}

	getCurrentScene() { return this.currentScene }
	changeGameMode(newMode) { this.mode = newMode; }
	getGameMode() { return this.mode }
	loadDialog(npc) { this.dialog.init(npc) }
	getDialog() { return this.dialog }
	getPlayer() { return this.player }
	loadPlayer() { if (localStorage.getItem("player") !== null) JSONUtil.loadFromJSON(this.player, localStorage.getItem("player")) }
	savePlayer() { localStorage.setItem("player", JSON.stringify(this.player)); console.log(JSON.stringify(this.player)) }
}

export const game = new Game();