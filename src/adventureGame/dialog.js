import { log } from "../controller/adventureLogController";
import { Game } from "./game";
import { PlayerAction } from "./player";
import { Command } from "./command";
export class Dialog {
	constructor() {
		this.npcName = "";
		this.dialog = {};
		this.responses = new Map();
	}

	init(npc) {
		this.npcName = npc.name;
		this.dialog = npc.dialog;
	}

	start() {
		log(`You start talking to /**${this.npcName}*\\`);
		this.logStatement(1);
	}

    /**
     * logStatement logs out statement given an id. Returns true if the statement is not null and there are valid responses
     * @param {string} statementId id of the statement in the dialog object
     */
	logStatement(statementId) {
		const statement = this.getStatement(statementId);
		if (statement === null) return false;
		log(`/**${this.npcName}*\\: ${statement.text}`);

		if (this.handleStatementQuestChanges(statement)) return false;

		let responses = [];
		if (Array.isArray(statement.responses)) {
			responses = statement.responses;
		} else if (typeof statement.responses === "object") {
			responses = [statement.responses];
		}
		return this.logResponses(responses);
	}

    /**
     * logResponses logs out array of responses from a statement to the adventure log returns true if the array is not null
     * @param {array} responses 
     */
	logResponses(responses) {
		if (responses === undefined || responses === null || responses.length === 0) return false;
		if (responses.length === 1 && (responses[0].text === undefined || responses[0].text === "")) {
			if (this.playerMeetsRequirements(responses[0])) {
				return this.logStatement(this.evalNextStatementId(responses[0].nextStatementId));
			}
		}
		let index = 1;
		responses.forEach((response) => {
			if (this.playerMeetsRequirements(response)) log(`<span class="response-text" data-nextStatementId="${this.evalNextStatementId(response.nextStatementId)}">${index++}. ${response.text}</span>`);
		});
		return true;
	}

	playerMeetsRequirements(response) {
		if (response.hasOwnProperty("questRequirement")) {
			let questCodeStrArray = [];
			const questRequirement = response["questRequirement"];
			if (questRequirement.match(/^(\d+\#(c|a|ua))(\,\d+\#(c|a|ua))+$/i)) { //if there are multiple quest requirements
				questCodeStrArray = questRequirement.split(",");
			} else if (questRequirement.match(/^(\d+\#(c|a|ua))$/i)) { //single quest requirement
				questCodeStrArray = [questRequirement];
			}
			return (questCodeStrArray.filter(questCodeStr => this.checkQuestStatus(questCodeStr))).length === questCodeStrArray.length;
		} else {
			return true;
		}
	}

	evalNextStatementId(statementIdStr) {
		if (statementIdStr.match(/^(\d+\#(c|a|ua))\?\d+\:\d+$/i)) {
			const tmpArray = statementIdStr.split("?", 2);
			const questCodeStr = tmpArray[0];
			const [id1, id2] = tmpArray[1].split(":", 2);
			return (this.checkQuestStatus(questCodeStr)) ? id1 : id2;
		} else {
			return statementIdStr;
		}
	}

	checkQuestStatus(questCodeStr) {
		let [questId, statusCode] = questCodeStr.split("#", 2);
		statusCode = statusCode.toLowerCase();
		const questLog = Game.getPlayer().getQuestLog();
		switch (statusCode) {
			case "a":
				return questLog.hasActiveQuest(questId);
			case "ua":
				return questLog.hasUnassignedQuest(questId);
			default: //assume completed
				return questLog.hasCompletedQuest(questId);
		}
	}

	handleStatementQuestChanges(statement) {
		const questLog = Game.getPlayer().getQuestLog();
		if (statement.hasOwnProperty("assignQuestId")) {
			return questLog.activateQuest(statement.assignQuestId);
		} else if (statement.hasOwnProperty("completeQuestId") && questLog.hasActiveQuest(statement.completeQuestId)) {
			const quest = questLog.activeQuestMap.get(statement.completeQuestId);
			const updateTrigger = quest.getUpdateTrigger();
			const action = (updateTrigger !== undefined) ? updateTrigger.getAction() : undefined;
			const nouns = (updateTrigger !== undefined) ? updateTrigger.getNouns() : undefined;

			if (action === PlayerAction.QUEST_HAND_IN) {
				const [mobId, ...itemInfo] = nouns;
				const itemObj = { type: "", rarity: "", itemName: "", quantity: 0 };
				if (itemInfo.length > 0 && mobId === this.getNPCName()) {
					if (itemInfo[0].includes("type:")) {
						itemObj.type = itemInfo[0].split(":", 2)[1];
						if (itemInfo[0].includes("type:")) {
							itemObj.rarity = itemInfo[0].split(":", 4)[3];
						}
					} else {
						itemObj.itemName = itemInfo[0];
					}
					itemObj.quantity = parseInt(itemInfo[1]);
					if (Command.questHandIn(this.getNPCName(), itemObj)) {
						questLog.completeActiveQuest(quest.getId());
					}
				}
			}
		}
	}

	/**
	 * getStatement returns the statement obj from dialog given a matching id
	 * @param {string} statementId 
	 */
	getStatement(statementId) {
		if (this.dialog === null || this.dialog === undefined || this.dialog === {}) return null;
		let foundStatement = null;
		this.dialog.forEach(statement => {
			if (parseInt(statement.id) === parseInt(statementId)) foundStatement = statement; return;
		});
		return foundStatement;
	}

	getResponses() { return this.responses }
	setResponses(responses) { this.responses = responses }

	getNPCName() { return this.npcName }
	getDialog() { return this.dialog }
}