class QuestCondition {
    conditionCounter = 0

    /**
     * @param {string} condition
     * @param {Quest} quest
     */
    constructor(condition, quest) {
        const parts = condition.split("+");
        this.conditionType = parts[0];
        this.conditionMaxCounter = parseInt(parts[1]);
        this.conditionData = (parts[2] || "").split("|");
        this.kingdomID = parts[4] ? parseInt(parts[4]) : quest.shownKingdomID;
        this.questID = quest.questID;
    }
}

module.exports = QuestCondition