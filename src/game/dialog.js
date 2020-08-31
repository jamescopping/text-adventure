import { log } from "../controller/adventureLogController";

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
		return this.logResponses(statement.responses);
	}

    /**
     * logResponses logs out array of responses from a statement to the adventure log returns true if the array is not null
     * @param {array} responses 
     */
	logResponses(responses) {
		if (responses === undefined || responses === null || responses.length === 0) return false;
		responses.forEach((response, index) => {
			log(`<span class="response-text" data-nextStatementId="${response.nextStatementId}">${index + 1}. ${response.text}</span>`);
		});
		return true;
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