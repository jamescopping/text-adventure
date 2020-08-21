import { Story } from "./story";
import { log } from "../controller/adventureLogController";
export class Scene {
    constructor() {
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
        let itemIndex = - 1;
        this.items.forEach((itemObj, index) => { if (itemObj["name"] === itemName) itemIndex = index; return; });
        if (itemIndex === -1) return null;
        return this.items.splice(itemIndex, 1)[0];
    }

    loadScene(sceneKey) {
        let scene = Scene.getScene(sceneKey);
        if (scene.name !== "" || scene.name !== undefined) {
            this.name = scene.hasOwnProperty("name") ? scene.name : "";
            this.description = scene.hasOwnProperty("description") ? scene.description : "";
            this.objects = scene.hasOwnProperty("objects") ? scene.objects.map(element => element["objectName"]) : [];
            this.mobs = scene.hasOwnProperty("mobs") ? scene.mobs.map(element => element["mobName"]) : [];

            this.items = [];
            if (scene.hasOwnProperty("items")) {
                scene.items.forEach(element => {
                    let itemObj = {
                        name: element["itemName"],
                        quantity: parseInt(element["quantity"]),
                        description: element["description"]
                    };
                    this.items.push(itemObj);
                });
            }

            this.paths = {};
            if (scene.hasOwnProperty("paths")) {
                scene.paths.forEach(element => {
                    this.paths[element["direction"]] = element["sceneName"];
                });
            }
            return true;
        } else {
            return false;
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

    getName() { return this.name }
    getDescription() { return this.description }
    getItems() { return this.items }
    getPaths() { return this.paths }
    getObjects() { return this.objects }
    getMobs() { return this.mobs }
}