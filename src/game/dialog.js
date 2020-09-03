import { log } from "../controller/adventureLogController";
import { game } from "./game";
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
		if (statement.hasOwnProperty("assignQuestId")) game.getPlayer().getQuestLog().activateQuest(statement.assignQuestId);
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
		responses.forEach((response, index) => {
			if (this.playerMeetsRequirements(response)) log(`<span class="response-text" data-nextStatementId="${this.evalNextStatementId(response.nextStatementId)}">${index + 1}. ${response.text}</span>`);
		});
		return true;
	}

	playerMeetsRequirements(response) {
		if (response.hasOwnProperty("questRequirement")) {
			let questIdArray = [];
			const questRequirement = response["questRequirement"];
			if (questRequirement.match(/^((\d+)(\,\d+)+)$/)) { //if there are multiple quest requirements
				questIdArray = questRequirement.split(",");
			} else if (questRequirement.match(/^(\d+)$/)) { //single quest requirement
				questIdArray = [questRequirement];
			}
			let allCompleted = true;
			const playerQuestLog = game.getPlayer().getQuestLog();
			questIdArray.forEach(questId => {
				if (!playerQuestLog.hasCompletedQuest(questId)) allCompleted = false; return;
			});
			return allCompleted;
		} else {
			return true;
		}
	}

	evalNextStatementId(statementIdStr) {
		if (statementIdStr.match(/^\d+\?\d+\:\d+$/g)) {
			const idArray = statementIdStr.split("?");
			const questId = idArray[0];
			const [id1, id2] = idArray[1].split(":");
			return (game.getPlayer().getQuestLog().hasCompletedQuest(questId)) ? id1 : id2;
		} else {
			return statementIdStr;
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