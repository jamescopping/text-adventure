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
        log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands. You can click text in [] to copy the content into the input box bellow. Use the TAB key to select available commands and then press ENTER key or CLICK to autocomplete the phrase. You can also use UP/DOWN arrow keys to run previously entered commands.");
        this.currentScene.init();
    }

    changeScene(direction) {
        if (!this.currentScene.getPaths().hasOwnProperty(direction)) return false;
        let sceneName = this.currentScene.getPaths()[direction];
        if (this.currentScene.loadScene(sceneName)) return true;
        return false;
    }

    getCurrentScene() { return this.currentScene }

    getPlayer() { return this.player }
    loadPlayer() { if (localStorage.getItem("player") !== null) JSONUtil.loadFromJSON(this.player, localStorage.getItem("player")) }
    savePlayer() { localStorage.setItem("player", JSON.stringify(this.player)); console.log(JSON.stringify(this.player)) }
}

export const game = new Game();
