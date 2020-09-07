import { Story } from "./story";
import { log } from "../controller/adventureLogController";
import { game, GameMode } from "./game";
import { MobStatus } from "./definitions";
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
		log("Combat started!");
		const combatMobs = this.mobs.filter(mobObj => mobObj.status === MobStatus.ALIVE && mobObj.type === "enemy");
		if (combatMobs.length === 0) return false;
		let outString = "Mob List: ";
		combatMobs.forEach((mobObj, index) => {
			outString += mobObj.mobName;
			if (index < combatMobs.length - 1) outString += ", ";
		});
		log(outString);
		this.combatLoop(combatMobs);
		this.endCombat();
	}

	combatLoop(combatMobsList) {
		let numberOfActiveMobs = combatMobsList.length;
		const updateNumOfActiveMobs = () => {
			numberOfActiveMobs = (combatMobsList.filter(mobObj => mobObj.status !== MobStatus.DEAD)).length;
		}
		const player = game.getPlayer();

		//combat is active while player is alive and there are active mobs to fight
		while (player.isAlive() && numberOfActiveMobs > 0) {


			setTimeout(() => { console.log(combatMobsList) }, 1000);




			updateNumOfActiveMobs();
		}
	}

	endCombat() {
		//save the states of the mobs that were in the combat
		this.enter
	}

	checkForCombat() { return this.mobs.some(mobObj => mobObj.status === MobStatus.ALIVE && mobObj.type === "enemy") }

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

			this.mobs = [];
			if (storyScene.hasOwnProperty("sceneMobs")) {
				storyScene.sceneMobs.forEach(element => {
					let mobObj = {
						mobName: element["mobName"],
						status: element["status"]
					};
					const storyMob = Story.getMob(mobObj.mobName);
					mobObj.stats = storyMob["stats"];
					mobObj.type = storyMob["type"];
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

	getMob(mobName) { return this.mobs.find(mob => mob.mobName === mobName) }

	getName() { return this.name }
	getDescription() { return this.description }
	getItems() { return this.items }
	getPaths() { return this.paths }
	getObjects() { return this.objects }
	getMobs() { return this.mobs }
}
Scene.visitedScenes = new Map();
