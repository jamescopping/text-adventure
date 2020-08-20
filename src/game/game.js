import { log } from "../controller/adventureLogController"
import { Player } from "./player";
import { JSONUtil } from "./util/jsonUtil";
import { Story } from "./story";
import { Scene } from "./scene";


export class Game {
    constructor() {
        this.player = new Player();
        this.currentScene = new Scene();
        this.loadPlayer();
        Story.loadStoryAssetsFromXML("./story/testStory.xml");
        this.currentScene.loadScene();
    }

    start() {
        log("Game started");
        log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands. Use the [Tab] key to select available commands and then press [Enter] key or [Click] to autocomplete the phrase. You can also use [Up/Down] arrow keys to run previously entered commands.");
        this.currentScene.init();
    }

    changeScene(direction) {
        let sceneName = this.currentScene.getPaths()[direction];
        this.currentScene.loadScene(sceneName);
        if (this.currentScene.isSceneLoaded()) this.currentScene.init();
    }

    getCurrentScene() { return this.currentScene }

    getPlayer() { return this.player }
    loadPlayer() { if (localStorage.getItem("player") !== null) JSONUtil.loadFromJSON(this.player, localStorage.getItem("player")) }
    savePlayer() { localStorage.setItem("player", JSON.stringify(this.player)); console.log(JSON.stringify(this.player)) }
}

export const game = new Game();
