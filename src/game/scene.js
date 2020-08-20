import { Story } from "./story";
import { log } from "../controller/adventureLogController";
export class Scene {
    constructor() {
        this.isLoaded = false
        this.name = "";
        this.description = "";
        this.paths = {};
        this.items = [];
        this.objects = [];
        this.mobs = [];
    }

    init() {
        //start the scene from the game when the scene changes from one to another
        this.enter();
    }

    enter() {
        log(this.getDescription());
    }

    pickupItem(itemName) {
        const index = this.items.indexOf(itemName);
        if (index === -1) return null;
        return this.items.splice(this.items.indexOf(itemName), 1)[0];
    }

    loadScene(sceneKey) {
        let scene = Scene.getScene(sceneKey);
        if (scene.name !== "" || scene.name !== undefined) {
            this.isLoaded = true;
            this.name = scene.hasOwnProperty("name") ? scene.name : "";
            this.description = scene.hasOwnProperty("description") ? scene.description : "";
            this.items = scene.hasOwnProperty("items") ? scene.items.map(element => element["itemName"]) : [];
            this.objects = scene.hasOwnProperty("objects") ? scene.objects.map(element => element["objectName"]) : [];
            this.mobs = scene.hasOwnProperty("mobs") ? scene.mobs.map(element => element["mobName"]) : [];
            this.paths = {};
            if (scene.hasOwnProperty("paths")) {
                scene.paths.forEach(element => {
                    this.paths[element["direction"]] = element["sceneName"];
                });
            }
        } else {
            this.constructor();
        }
    }


    static getScene(sceneKey) {
        let scene;
        if (sceneKey !== undefined) {
            scene = Story.getSceneMap().get(sceneKey);
        } else {
            const list = Story.getSceneMap().values();
            [...list].forEach(element => {
                if (element.hasOwnProperty("startScene")) {
                    scene = element;
                }
            });
        }
        if (scene === null) { console.log(`Error loading scene [${sceneKey}]`); return; }
        return scene;
    }



    isSceneLoaded() { return this.isLoaded }
    getName() { return this.name }
    getDescription() { return this.description }
    getItems() { return this.items }
    getPaths() { return this.paths }
    getObjects() { return this.objects }
    getMobs() { return this.mobs }
}