const {quests} = require('e4k-data').data
const Quest = require("./Quest");

class QuestData {
    #client;
    /** @type {Quest[]} */
    _activeQuests = [];
    /** @type {{[id:number]: true}} */
    _completedQuests = {};

    /** @param {Client} client */
    constructor(client) {
        this.#client = client;
    }

    /**
     * @param {number} questId
     * @return {Quest | null}
     */
    createQuest(questId) {
        const activeQuest = this._activeQuests.find(x => x.id === questId)
        if (activeQuest !== undefined) return activeQuest;
        const quest = quests.find(q => q.questID === questId);
        if (quest) return new Quest(this.#client, quest);
        return null;
    }

    /** @param {Quest} quest */
    addQuestToList(quest) {
        this._activeQuests.push(quest);
    }

    sort() {
        this._activeQuests.sort((a, b) => a.id - b.id)
    }

    /** @param {number} questId */
    startQuest(questId) {
        const quest = this.createQuest(questId);
        if (quest) this.addQuestToList(quest);
    }

    /** @param {number} questId */
    finishQuest(questId) {
        this.removeQuest(questId);
        this.markQuestCompleted(questId);
    }

    /** @param {number} questId */
    removeQuest(questId) {
        this._activeQuests.splice(this._activeQuests.findIndex(q => q.questID === questId), 1);
    }

    /** @param {number} questId */
    markQuestCompleted(questId) {
        this._completedQuests[questId] = true;
    }

    getActiveQuests() {
        return this._activeQuests;
    }
}

module.exports = QuestData