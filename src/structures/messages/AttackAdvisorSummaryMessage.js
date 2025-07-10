const BasicAttackAdvisorMessage = require("./BasicAttackAdvisorMessage");
const Localize = require("../../tools/Localize");
const {readMessages} = require("../../commands/rms");
const Good = require("../Good");

class AttackAdvisorSummaryMessage extends BasicAttackAdvisorMessage {
    /** @type {Client} */
    #client = null;
    advisorOverviewInfo;

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    async init() {
        this.advisorOverviewInfo = await parseAdvisorOverview(this.#client, this.messageId);
    }

    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.subject = Localize.text(client, `title_advisor_AttackSummary`);
    }
}

/**
 * @param {Client} client
 * @param {number} messageId
 * @returns {Promise<{}>}
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