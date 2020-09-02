
import { Story } from "./story"
import { log } from "../controller/adventureLogController"

export class QuestLog {

    constructor() {
        this.activeQuestMap = new Map();
        this.completedQuestMap = new Map();
        this.unassignedQuestMap = new Map();
        this.unassignedActionListenerSet = new Set();
        this.activeActionListenerSet = new Set();

        Story.getQuestMap().forEach(quest => {
            const storyQuest = Quest.fromStory(quest);
            this.unassignedQuestMap.set(quest.id, storyQuest);
            const assignAction = storyQuest.getAssignTrigger().getAction();
            if (assignAction !== "") this.unassignedActionListenerSet.add(assignAction);
        });
    }

    receivePlayerEvent(playerEvent) {
        //the player event is received, now we need to see if there are any active quests that need to be updated by this specific event
        if (this.activeActionListenerSet.has(playerEvent.getAction())) {
            //the so there is a quest that is in the active list that is listening for this action
            const filterQuests = this.filterQuests([...this.activeQuestMap.values()], playerEvent, "update");
            filterQuests.forEach(quest => {
                quest.trigger(1);
                if (quest.isCompleted()) {
                    this.completeActiveQuest(quest.getId());
                };
            });
        }
        if (this.unassignedActionListenerSet.has(playerEvent.getAction())) {
            const filterQuests = this.filterQuests([...this.unassignedQuestMap.values()], playerEvent, "assign");
            filterQuests.forEach(quest => {
                this.activateQuest(quest.getId());
            });
        }
    }

    filterQuests(quests, event, triggerType) {
        return quests.filter(quest => {
            const trigger = (triggerType === "update") ? quest.getUpdateTrigger() : quest.getAssignTrigger();
            if (trigger.getAction() === event.getAction()) {
                const nouns = trigger.getNouns();
                if (nouns === undefined || nouns === null || nouns.length === 0) return true;
                const eventArgs = event.getArgs();
                let matchNouns = true;
                nouns.forEach((noun, index) => {
                    if (noun !== eventArgs[index]) matchNouns = false; return;
                });
                return matchNouns;
            }
        });
    }

    activateQuest(questId) {
        if (!this.hasUnassignedQuest(questId) && (this.hasActiveQuest(questId) || this.hasCompletedQuest(questId))) return false;
        const assignedQuest = this.unassignedQuestMap.get(questId);
        if (assignedQuest === null || assignedQuest === undefined) return false;
        this.activeQuestMap.set(questId, assignedQuest);
        this.unassignedQuestMap.delete(questId);

        const action = assignedQuest.getUpdateTrigger().getAction();
        this.activeActionListenerSet.add(action);
        let sameAction = false;
        this.unassignedQuestMap.forEach(unassignedQuest => {
            if (unassignedQuest.getUpdateTrigger().getAction() === action) sameAction = true; return;
        });
        if (!sameAction) this.unassignedActionListenerSet.delete(action);

        log(`New Quest: ${assignedQuest.getName()}, ${assignedQuest.getDescription()}`);
        return true;
    }

    completeActiveQuest(questId) {
        const completedQuest = this.activeQuestMap.get(questId);
        this.completedQuestMap.set(questId, completedQuest);
        this.activeQuestMap.delete(questId);

        log(`Quest Completed! ${completedQuest.getName()}`);
        this.activateQuest(completedQuest.getNextQuestId());
        //possibly remove the action from the listener set if there are no other active ones with that action
        const action = completedQuest.getUpdateTrigger().getAction();
        let sameAction = false;
        this.activeQuestMap.forEach(activeQuest => {
            if (activeQuest.getUpdateTrigger().getAction() === action) sameAction = true; return;
        });
        if (!sameAction) this.activeActionListenerSet.delete(action);
    }

    logActiveQuests() {
        log("Active Quest Log: ");
        if (this.activeQuestMap.size !== 0) {
            this.activeQuestMap.forEach(quest => {
                log(`${quest.getName()} ${quest.percentageComplete()}% : ${quest.getDescription()}`);
            });
        } else {
            log("No active quests!");
        }
    }

    logCompletedQuests() {
        log("Completed Quest Log: ");
        if (this.completedQuestMap.size !== 0) {
            this.completedQuestMap.forEach(quest => {
                log(`${quest.getName()} ${quest.percentageComplete()}% : ${quest.getDescription()}`);
            });
        } else {
            log("No completed quests!");
        }
    }

    hasActiveQuest(questId) { return this.activeQuestMap.has(questId); }
    hasCompletedQuest(questId) { return this.completedQuestMap.has(questId); }
    hasUnassignedQuest(questId) { return this.unassignedQuestMap.has(questId) }
    toString() { return `Active Quests: ${this.activeQuestMap} \n Completed Quests: ${this.completedQuestMap}\n` }
}

class Quest {
    constructor(id, name, description, updateTrigger, assignTrigger, requiredTriggers, nextQuestId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.requiredTriggers = requiredTriggers;
        this.nextQuestId = nextQuestId;
        this.triggerCount = 0;
        this.updateTrigger = new QuestTrigger(updateTrigger.action, updateTrigger.nouns);
        this.assignTrigger = new QuestTrigger(assignTrigger.action, assignTrigger.nouns);
        this.complete = false;
    }

    trigger(amount) {
        this.triggerCount += amount;
        if (this.triggerCount < 0) this.triggerCount = 0;
        const diff = this.triggerCount - this.requiredTriggers;
        if (this.triggerCount > this.requiredTriggers) this.triggerCount = this.requiredTriggers;
        this.isTriggerRequirementMet();
        return diff;
    }


    isTriggerRequirementMet() {
        this.complete = (this.requiredTriggers <= this.triggerCount);
        return this.complete;
    }
    isCompleted() { return this.complete }
    percentageComplete() { return Math.round((this.triggerCount / this.requiredTriggers) * 100) }

    static fromStory(storyQuest) {
        return new Quest(storyQuest.id, storyQuest.name, storyQuest.description, storyQuest.triggers.update, storyQuest.triggers.assign, storyQuest.triggers.complete.requiredTriggers, storyQuest.triggers.complete.nextQuestId);
    }

    getId() { return this.id }
    getName() { return this.name }
    getDescription() { return this.description }
    getUpdateTrigger() { return this.updateTrigger }
    getAssignTrigger() { return this.assignTrigger }
    getRequiredTriggers() { return this.requiredTriggers }
    getNextQuestId() { return this.nextQuestId }
    getTriggerCount() { return this.triggerCount }

}

class QuestTrigger {
    constructor(action, nouns) {
        this.action = action;
        this.nouns = nouns;
    }
    getAction() { return this.action }
    getNouns() { return this.nouns }
}