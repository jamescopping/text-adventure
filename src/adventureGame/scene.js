import { Story } from "./story";
import { Stats } from "./stats";
import { log } from "../controller/adventureLogController";
import { Game, GameMode } from "./game";
import { MobStatus } from "./stats";
import { Inventory } from "./inventory";
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
			let combatStarted = Game.getCombat().start();
			if (!combatStarted) this.exploreScene();
		} else {
			this.exploreScene();
		}
	}

	checkForCombat() { return this.mobs.some(mobObj => mobObj.stats.getStatus() === MobStatus.ALIVE && mobObj.type === "enemy") }


	exploreScene() {
		Game.changeGameMode(GameMode.ADVENTURE);
		log(this.getDescription());
		//log the paths that you can choose
		let outString = "Paths: | ";
		Object.keys(this.paths).forEach(direction => {
			outString += `\<-${direction}-\> | `;
		});
		log(outString);
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
			this.objects = [];
			if (storyScene.hasOwnProperty("sceneObjects")) {
				storyScene.sceneObjects.forEach(element => {
					const storyObject = Story.getObject(element["objectName"]);
					let object = {};
					console.log(storyObject);
					object.objectName = element["objectName"];
					object.description = storyObject["description"];
					object.fsm = storyObject["fsm"];
					this.objects.push(object);
				});
			}

			this.mobs = [];
			if (storyScene.hasOwnProperty("sceneMobs")) {
				storyScene.sceneMobs.forEach(element => {
					const storyMob = Story.getMob(element["mobName"]);
					let mobObj = {};
					mobObj.mobName = element["mobName"];
					mobObj.stats = new Stats(storyMob["stats"]["resources"]);
					mobObj.stats.setInitiativeBonus(storyMob["stats"]["initiativeBonus"]);
					mobObj.stats.setArmourClass(storyMob["stats"]["armourClass"]);
					mobObj.stats.setAttackBonus(storyMob["stats"]["attackBonus"]);
					mobObj.stats.setStatus(element["status"]);
					mobObj.inventory = new Inventory([], 100);
					mobObj.type = storyMob["type"];
					const startingInv = storyMob["inventory"];
					if (Array.isArray(startingInv)) {
						mobObj.inventory.addItems(startingInv);
					} else if (typeof startingInv === "object" && startingInv.hasOwnProperty("inventoryItem")) {
						mobObj.inventory.addItem(startingInv.inventoryItem);
					}
					this.mobs.push(mobObj);
				});
			}

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
			scene = Story.getScene(sceneKey);
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
	static setLastSceneName(sceneName) { Scene.lastSceneName = sceneName }
	static getLastSceneName() { return Scene.lastSceneName }

	getName() { return this.name }
	getDescription() { return this.description }
	getItems() { return this.items }
	getPaths() { return this.paths }
	getObjects() { return this.objects }
	getMobs() { return this.mobs }
	getMob(mobName) { return this.mobs.find(mob => mob.mobName === mobName) }
}
Scene.visitedScenes = new Map();
Scene.lastSceneName = "";
