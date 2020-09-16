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
		Game.mode = GameMode.ADVENTURE;
		Game.currentScene = new Scene();
		Game.player = new Player();
		Game.dialog = new Dialog();
		Game.combat = new Combat();

		Story.loadStoryAssetsFromXML("testStory");
		Game.currentScene.loadScene();
		Game.loadPlayer();
	}

	static start() {
		Game.init();
		log("Game started");
		PlayerEvent.broadcastPlayerEvent(new PlayerEvent(PlayerAction.START));
		Game.currentScene.init();
	}

	static changeScene(sceneName) {
		Game.currentScene.saveSceneState();
		Scene.setLastSceneName(Game.currentScene.getName());
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
		Game.player.init();
		if (JSON.stringify(Story.getPlayerObj()) !== JSON.stringify({})) {
			Game.player.loadStoryPlayerObj(Story.getPlayerObj());
		}
		// if (localStorage.getItem("player") !== null) {
		// 	JSONUtil.loadFromJSON(Game.player, localStorage.getItem("player"))
		// } 
	}
	static savePlayer() { localStorage.setItem("player", JSON.stringify(Game.player)); console.log(JSON.stringify(Game.player)) }
}
export const game = new Game();