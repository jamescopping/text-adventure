import { Story } from "./story"

export class QuestLog {

    constructor() {
        console.log("questLog created for player");
        this.activeQuests = new Map();
        this.completedQuests = new Map();
    }

    static receivePlayerEvent(playerEvent) {
        //the player event is received, now we need to see if there are any active quests that need to be updated by this specific event
    }

    addNewQuest(questId) {
        const storyQuest = QuestLog.getStoryQuest(questId);
        if (storyQuest === null || storyQuest === undefined) return false;
        if (this.hasActiveQuest(questId) || this.hasCompletedQuest(questId)) return false;

        //add extra properties to the questObj so that the task can be tracked


        this.activeQuests.set(questId, storyQuest);
        return true;
    }

    //completeActiveQuest
    completeActiveQuest(questId) {
        const completedQuest = this.activeQuests.get(questId);
        this.completedQuests.set(questId, completedQuest);
        this.activeQuests.delete(questId);
        console.log(this.activeQuests);
        console.log(this.completedQuests);
    }


    hasActiveQuest(questId) { return this.activeQuests.has(questId); }
    hasCompletedQuest(questId) { return this.completedQuests.has(questId); }
    static getStoryQuest(questId) { return Story.getQuestMap().get(questId); }
    toString() { return `Active Quests: ${this.activeQuests} \n Completed Quests: ${this.completedQuests}\n` }

}
