import { Story } from "../story"

export const QuestAction = {
    PICKUP: 'pickup',
    INVESTIGATE: 'investigate',
    GIVE: 'give',
    KILL: 'kill',
    SELL: 'sell',
    DISCOVER: 'discover',
}


export class QuestLog {

    constructor() {
        console.log("questLog created for player");
        this.activeQuests = new Map();
        this.completedQuests = new Map();
    }


    addNewQuest(questId) {
        const storyQuest = QuestLog.getStoryQuest(questId);
        console.log(storyQuest);
        if (storyQuest === null || storyQuest === undefined) return false;
        if (this.hasActiveQuest(questId) || this.hasCompletedQuest(questId)) return false;
        this.activeQuests.set(questId, storyQuest);
        return true;
    }

    hasActiveQuest(questId) {
        return this.activeQuests.has(questId);
    }

    hasCompletedQuest(questId) {
        return this.completedQuests.has(questId);
    }

    static getStoryQuest(questId) {
        return Story.getQuestMap().get(questId);
    }

    toString() {
        return `Active Quests: ${this.activeQuests} \n Completed Quests: ${this.completedQuests}\n`
    }

}
