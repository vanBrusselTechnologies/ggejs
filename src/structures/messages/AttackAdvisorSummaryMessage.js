const BasicAttackAdvisorMessage = require("./BasicAttackAdvisorMessage");
const Good = require("../Good");
const {readMessages} = require("../../commands/rms");
const EmpireError = require("../../tools/EmpireError");
const Localize = require("../../tools/Localize");

class AttackAdvisorSummaryMessage extends BasicAttackAdvisorMessage {
    /** @type {Client} */
    #client = null;
    /** @type {AdvisorOverviewInfo | undefined} */
    _advisorOverviewInfo = undefined;

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    async getAdvisorOverviewInfo() {
        try {
            if (this._advisorOverviewInfo !== undefined) return this._advisorOverviewInfo;
            this._advisorOverviewInfo = await parseAdvisorOverview(this.#client, this.messageId);
            return this._advisorOverviewInfo;
        } catch (e) {
            throw EmpireError(this.#client, e);
        }
    }

    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.subject = Localize.text(client, `title_advisor_AttackSummary`);
    }
}

/**
 * @param {Client} client
 * @param {number} messageId
 * @returns {Promise<AdvisorOverviewInfo>}
 */
async function parseAdvisorOverview(client, messageId) {
    const stringData = await readMessages(client, messageId);
    const data = JSON.parse(stringData);
    // TODO: rewrite into separate class
    return {
        commandersAmount: data["C"],
        lootGoods: data.G.map(g => new Good(client, g)),
        costsGoods: data.L.map(g => new Good(client, g)),
        lostUnitsAmount: data["LU"],
        lostToolsAmount: data["LT"],
        attacksAmountWin: data["W"],
        attacksAmountDefeat: data["D"],
        attacksAmountPending: data["P"],
    }
}

module.exports = AttackAdvisorSummaryMessage;