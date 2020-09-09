import { log } from "../controller/adventureLogController"
import { Player, PlayerEvent, PlayerAction } from "./player";
import { Story } from "./story";
import { Scene } from "./scene";
import { Dialog } from "./dialog";
import { Combat } from "./combat";
export const GameMode = {
	ADVENTURE: "adventure",
	COMBAT: "combat",
	DIALOG: "dialog"
}

export class Game {
	static init() {
		Story.loadStoryAssetsFromXML("testStory");
		Game.currentScene.loadScene();
		Game.loadPlayer();
	}

	static start() {
		Game.init();
		log("Game started");
		log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands. You can click text that is highlighted and a corresponding command will be executed. Use the TAB key to select available commands and then press ENTER key or CLICK to autocomplete the phrase. You can also use UP/DOWN arrow keys to run previously entered commands.");
		Game.currentScene.init();
		PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.START));
	}

	static changeScene(sceneName) {
		Game.currentScene.saveSceneState();
		Game.currentScene.loadScene(sceneName);
		return true;
	}

	static getCurrentScene() { return Game.currentScene }
	static changeGameMode(newMode) { Game.mode = newMode; }
	static getGameMode() { return Game.mode }
	static loadDialog(npc) { Game.dialog.init(npc) }
	static getDialog() { return Game.dialog }
	static getPlayer() { return Game.player }
	static getCombat() { return Game.combat }
	static loadPlayer() {
		if (JSON.stringify(Story.getPlayerObj()) !== JSON.stringify({})) {
			Game.player.loadStoryPlayerObj(Story.getPlayerObj());
		}
		// if (localStorage.getItem("player") !== null) {
		// 	JSONUtil.loadFromJSON(Game.player, localStorage.getItem("player"))
		// } 
	}
	static savePlayer() { localStorage.setItem("player", JSON.stringify(Game.player)); console.log(JSON.stringify(Game.player)) }
}

Game.mode = GameMode.ADVENTURE;
Game.player = new Player();
Game.currentScene = new Scene();
Game.dialog = new Dialog();
Game.combat = new Combat();

export const game = new Game();