const QuestCondition = require("./QuestCondition");

class Quest {
    #client;

    _rawData;
    /** @type {QuestCondition[]} */
    _conditions = []

    /**
     * @param {Client} client
     * @param {Quest} data
     */
    constructor(client, data) {
        this.#client = client;
        this.id = data.questID
        this._rawData = data;

        this._conditions = data.conditions.split('#').map(c => new QuestCondition(c, data))
    }

    /** @param {number[]} data */
    fillProgress(data) {
        if (!data) return;
        let i = 0;
        while (i < this._conditions.length) {
            this._conditions[i].conditionCounter = data[i];
            i++;
        }
    }
}

module.exports = Quest