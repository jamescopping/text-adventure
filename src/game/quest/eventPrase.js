export class EventPhrase {

    constructor(action, subject, object, amount) {
        this.action = action;
        this.subject = subject;
        this.object = object;
        this.amount = amount;
    }




}





/*
    format of the quest event

    sendEventPhrase(eventPhrase)

    eventPhrase = {
        action: QuestAction
        subject: null/player/npc/scene
        object: null/item/object
    }

*/