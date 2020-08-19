import { log } from "../controller/adventureLogController"
import { Player } from "./player";
import { JSONUtil } from "./util/jsonUtil";
import { story, Story } from "./story";


export class Game {
    constructor() {
        this.player = new Player();
        this.loadPlayer();



        Story.loadStoryAssetsFromXML("./story/testStory.xml");
        console.log(Story.getSceneMap());
        console.log(Story.getMobMap());
        console.log(Story.getObjectMap());
        console.log(Story.getSpellMap());
        console.log(Story.getItemMap());
    }

    start() {

        log("Game started");
        log("Hello This is a text adventure game, currently work in progress! type '/help' to see a list of commands. Use the [Tab] key to select available commands and then press [Enter] key or [Click] to autocomplete the phrase. You can also use [Up/Down] arrow keys to run previously entered commands.");

        this.player.inventory.addItems(["magic_box", "key#4"]);
    }

    loadPlayer() { if (localStorage.getItem("player") !== null) JSONUtil.loadFromJSON(this.player, localStorage.getItem("player")) }
    savePlayer() { localStorage.setItem("player", JSON.stringify(this.player)); console.log(JSON.stringify(this.player)) }
}

export const game = new Game();
