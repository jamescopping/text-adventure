import { FileUtil } from "./util/fileUtil.js";
import { DomUtil } from "./util/domUtil.js";

export class Story {

	static loadStoryAssetsFromXML(fileName) {
		let xml = FileUtil.stringToXML(require("./story/testStory.xml"));

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
	}

	static getSceneMap() { return Story.sceneMap }
	static getItemMap() { return Story.itemMap }
	static getObjectMap() { return Story.objectMap }
	static getMobMap() { return Story.mobMap }
	static getSpellMap() { return Story.spellMap }
	static getQuestMap() { return Story.questMap }
}

Story.sceneMap = new Map();
Story.itemMap = new Map();
Story.objectMap = new Map();
Story.mobMap = new Map();
Story.spellMap = new Map();
Story.questMap = new Map();

export const story = new Story();
