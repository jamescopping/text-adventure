
import { Story } from "./story"
import { log } from "../controller/adventureLogController"
import { PlayerAction, PlayerEvent } from "./player";

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
            const assignTrigger = storyQuest.getAssignTrigger();
            const assignAction = (assignTrigger !== undefined) ? assignTrigger.getAction() : undefined;
            if (assignAction !== "" && assignAction !== undefined) this.unassignedActionListenerSet.add(assignAction);
        });
    }

    receivePlayerEvent(playerEvent) {
        //the player event is received, now we need to see if there are any active quests that need to be updated by this specific event
        this.triggerEventForQuests(playerEvent);
    }

    triggerEventForQuests(playerEvent) {
        if (this.unassignedActionListenerSet.has(playerEvent.getAction())) {
            const filterQuests = this.filterQuestsOnPlayerEvent([...this.unassignedQuestMap.values()], playerEvent, "assign");
            filterQuests.forEach(quest => this.activateQuest(quest.getId()));
        }
        if (this.activeActionListenerSet.has(playerEvent.getAction())) {
            //the so there is a quest that is in the active list that is listening for this action
            const filterQuests = this.filterQuestsOnPlayerEvent([...this.activeQuestMap.values()], playerEvent, "update");
            filterQuests.forEach(quest => this.triggerUpdateForQuest(quest));
        }
    }

    triggerUpdateForQuest(quest) {
        const updateTrigger = quest.getUpdateTrigger();
        const nouns = (updateTrigger !== undefined) ? updateTrigger.getNouns() : undefined;
        let triggerCount = (nouns !== undefined && nouns.includes("{triggerCount}")) ? parseInt(playerEvent.getArgs()[nouns.indexOf("{triggerCount}")]) : 1;
        quest.trigger(triggerCount);
        if (quest.isCompleted()) {
            this.completeActiveQuest(quest.getId());
        };
    }

    filterQuestsOnPlayerEvent(quests, event, triggerType) {
        return quests.filter(quest => {
            const trigger = (triggerType === "update") ? quest.getUpdateTrigger() : quest.getAssignTrigger();
            const action = (trigger !== undefined) ? trigger.getAction() : undefined;
            if (action === event.getAction()) {
                const nouns = trigger.getNouns();
                const eventArgs = event.getArgs();
                if (nouns.length === 0 && eventArgs.length === 0) return true;
                let matchNouns = true;
                nouns.forEach((noun, index) => {
                    if (noun !== eventArgs[index] && noun !== "{triggerCount}") matchNouns = false; return;
                });
                return matchNouns;
            }
        });
    }

    activateQuest(questId) {
        if (questId === "" || questId === undefined) return false;
        if (!this.hasUnassignedQuest(questId) && (this.hasActiveQuest(questId) || this.hasCompletedQuest(questId))) return false;
        const assignedQuest = this.unassignedQuestMap.get(questId);
        if (assignedQuest === null || assignedQuest === undefined) return false;
        this.activeQuestMap.set(questId, assignedQuest);
        this.unassignedQuestMap.delete(questId);

        log(`New Quest: ${assignedQuest.getName()}, ${assignedQuest.getDescription()}`);
        this.checkQuestAlreadyCompleted(assignedQuest);


        const updateTrigger = assignedQuest.getUpdateTrigger();
        const assignTrigger = assignedQuest.getAssignTrigger();

        const updateAction = (updateTrigger !== undefined) ? updateTrigger.getAction() : undefined;
        const assignAction = (assignTrigger !== undefined) ? assignTrigger.getAction() : undefined;
        if (updateAction !== undefined) this.activeActionListenerSet.add(updateAction);
        if (assignAction !== undefined)
            if (![...this.unassignedQuestMap.values()].some(unassignedQuest => {
                const trigger = unassignedQuest.getAssignTrigger();
                const action = (trigger !== undefined) ? trigger.getAction() : undefined;
                if (action !== undefined) {
                    return assignAction === action;
                } else {
                    return false;
                }
            })) { this.unassignedActionListenerSet.delete(assignAction) }
        return true;
    }

    completeActiveQuest(questId) {
        if (questId === "" || questId === undefined) return false;
        if (!this.hasActiveQuest(questId) && (this.hasUnassignedQuest(questId) || this.hasCompletedQuest(questId))) return false;
        const completedQuest = this.activeQuestMap.get(questId);
        if (completedQuest === null || completedQuest === undefined) return false;
        this.completedQuestMap.set(questId, completedQuest);
        this.activeQuestMap.delete(questId);

        log(`Quest Completed! ${completedQuest.getName()}`);
        this.activateQuest(completedQuest.getNextQuestId());

        const updateTrigger = completedQuest.getUpdateTrigger();
        const updateAction = (updateTrigger !== undefined) ? updateTrigger.getAction() : undefined;
        if (updateAction !== undefined)
            if (![...this.activeQuestMap.values()].some(activeQuest => {
                const trigger = activeQuest.getAssignTrigger();
                const action = (trigger !== undefined) ? trigger.getAction() : undefined;
                if (action !== undefined) {
                    return updateAction === action;
                } else {
                    return false;
                }
            })) { this.activeActionListenerSet.delete(updateAction) }
        return true;
    }

    checkQuestAlreadyCompleted(quest) {
        const trigger = quest.getUpdateTrigger();
        const action = (trigger !== undefined) ? trigger.getAction() : undefined;
        if (PlayerEvent.getAllEventsWithAction(action).some(event => this.filterQuestsOnPlayerEvent([quest], event, "update").length === 1)) {
            quest.trigger(999);
            this.completeActiveQuest(quest.getId());
        }
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
        this.updateTrigger = (updateTrigger !== undefined) ? new QuestTrigger(updateTrigger.action, updateTrigger.nouns) : undefined;
        this.assignTrigger = (assignTrigger !== undefined) ? new QuestTrigger(assignTrigger.action, assignTrigger.nouns) : undefined;
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

    setTriggerCount(count) { this.triggerCount = count; this.isTriggerRequirementMet(); }

}

class QuestTrigger {
    constructor(action, nouns) {
        this.action = action;
        this.nouns = nouns === undefined ? [] : nouns;
    }
    getAction() { return this.action }
    getNouns() { return this.nouns }
}