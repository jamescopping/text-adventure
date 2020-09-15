import { FileUtil } from "./util/fileUtil.js";
import { DomUtil } from "./util/domUtil.js";

export class Story {

	static loadStoryAssetsFromXML(fileName) {
		let xml = FileUtil.stringToXML(require(`./story/${fileName}.xml`));
		const initMap = (map, xmlArray) => {
			[...xmlArray].forEach(node => {
				let key = node.children[0].textContent;
				map.set(key, DomUtil.xmlToObj(node.children));
			});
		}

		initMap(Story.sceneMap, xml.getElementsByTagName("scene"));
		initMap(Story.itemMap, xml.getElementsByTagName("item"));
		initMap(Story.mobMap, xml.getElementsByTagName("mob"));
		initMap(Story.objectMap, xml.getElementsByTagName("object"));
		initMap(Story.spellMap, xml.getElementsByTagName("spell"));
		initMap(Story.questMap, xml.getElementsByTagName("quest"));

		let playerXML = xml.getElementsByTagName("player");
		if (playerXML.length === 1) {
			Story.playerObj = DomUtil.xmlToObj(xml.getElementsByTagName("player"));
		}

		xml = null;
	}

	static getScene(sceneName) { return Story.sceneMap.get(sceneName) }
	static getItem(itemName) { return Story.itemMap.get(itemName) }
	static getObject(objectName) { return Story.objectMap.get(objectName) }
	static getMob(mobName) { return Story.mobMap.get(mobName) }
	static getSpell(spellName) { return Story.spellMap.get(spellName) }
	static getQuest(questId) { return Story.questMap.get(questId) }


	static getSceneMap() { return Story.sceneMap }
	static getItemMap() { return Story.itemMap }
	static getObjectMap() { return Story.objectMap }
	static getMobMap() { return Story.mobMap }
	static getSpellMap() { return Story.spellMap }
	static getQuestMap() { return Story.questMap }
	static getPlayerObj() { return Story.playerObj }
}

Story.sceneMap = new Map();
Story.itemMap = new Map();
Story.objectMap = new Map();
Story.mobMap = new Map();
Story.spellMap = new Map();
Story.questMap = new Map();
Story.playerObj = {};

export const story = new Story();
