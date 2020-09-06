import { Story } from "./story";
import { log } from "../controller/adventureLogController";
import { game, GameMode } from "./game";
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
		//if there are mobs to fight then go into combat mode
		if (this.checkForCombat()) {
			this.startCombat();
		} else {
			this.exploreScene();
		}
	}

	startCombat() {
		game.changeGameMode(GameMode.COMBAT);
	}

	exploreScene() {
		game.changeGameMode(GameMode.ADVENTURE);
		log(this.getDescription());
		//log the paths that you can choose
		let outString = "Paths: | ";
		Object.keys(this.paths).forEach(direction => {
			outString += `\<-${direction}-\> | `;
		});
		log(outString);
	}


	checkForCombat() {
		return false;
	}

	pickupItem(itemName) {
		let itemIndex = - 1;
		this.items.some((itemObj, index) => {
			if (itemObj["itemName"] === itemName) {
				itemIndex = index;
				return true;
			};
			return false;
		});
		if (itemIndex === -1) return null;
		return this.items.splice(itemIndex, 1)[0];
	}

	loadVisitedScene(sceneName) {
		Object.assign(this, Scene.getVisitedScene(sceneName));
	}

	loadScene(sceneName) {
		if (Scene.hasSceneBeenVisited(sceneName)) {
			this.loadVisitedScene(sceneName);
		} else {
			const storyScene = Scene.getStoryScene(sceneName);
			this.initSceneDataFromStory(storyScene);
		}
	}

	initSceneDataFromStory(storyScene) {
		if (storyScene.name !== "" || storyScene.name !== undefined) {
			this.name = storyScene.hasOwnProperty("name") ? storyScene.name : "";
			this.description = storyScene.hasOwnProperty("description") ? storyScene.description : "";
			this.objects = storyScene.hasOwnProperty("sceneObjects") ? storyScene.sceneObjects.map(element => element["objectName"]) : [];
			this.mobs = storyScene.hasOwnProperty("sceneMobs") ? storyScene.sceneMobs.map(element => element["mobName"]) : [];

			this.items = [];
			if (storyScene.hasOwnProperty("sceneItems")) {
				storyScene.sceneItems.forEach(element => {
					let itemObj = {
						itemName: element["itemName"],
						quantity: parseInt(element["quantity"]),
						description: element["description"]
					};
					this.items.push(itemObj);
				});
			}

			this.paths = {};
			if (storyScene.hasOwnProperty("paths")) {
				storyScene.paths.forEach(element => {
					this.paths[element["direction"]] = element["sceneName"];
				});
			}
			return true;
		} else {
			return false;
		}
	}

	static getStoryScene(sceneKey) {
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

	saveSceneState() { Scene.visitedScenes.set(this.getName(), Object.assign(Object.create(this), this)); }
	static getVisitedScenes() { return Scene.visitedScenes }
	static hasSceneBeenVisited(sceneName) { return Scene.visitedScenes.has(sceneName) }
	static getVisitedScene(sceneName) { return Scene.visitedScenes.get(sceneName) }

	getName() { return this.name }
	getDescription() { return this.description }
	getItems() { return this.items }
	getPaths() { return this.paths }
	getObjects() { return this.objects }
	getMobs() { return this.mobs }
}
Scene.visitedScenes = new Map();
