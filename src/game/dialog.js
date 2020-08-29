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

    logStatement(statementId) {
        const statement = this.getStatement(statementId);
        if (statement !== null) {
            log(`/**${this.npcName}*\\: ${statement.text}`);
            statement.responses.forEach((response, index) => {
                log(`<span class="response-text" data-nextStatementId="${response.nextStatementId}">${index + 1}. ${response.text}</span>`);
            });
            return true;
        } else {
            return false;
        }
    }

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