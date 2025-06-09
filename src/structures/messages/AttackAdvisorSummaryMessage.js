const BasicAttackAdvisorMessage = require("./BasicAttackAdvisorMessage");
const Localize = require("../../tools/Localize");
const {WaitUntil} = require("../../tools/wait");
const {execute: readMessage} = require("../../e4kserver/commands/readMessages");
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
        this.advisorOverviewInfo = await parseAdvisorOverview(this.#client._socket, this.messageId);
        this.#client._socket[`rms -> ${this.messageId}`] = null;
    }

    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.subject = Localize.text(client, `title_advisor_AttackSummary`);
    }
}

/**
 * @param {Socket} socket
 * @param {number} messageId
 * @returns {Promise<{}>}
 */
async function parseAdvisorOverview(socket, messageId) {
    readMessage(socket, messageId);
    const stringData = await WaitUntil(socket, `rms -> ${messageId}`);
    delete socket[`rms -> ${messageId}`];
    const data = JSON.parse(stringData);
    // TODO: rewrite into separate class
    return {
        commandersAmount: data["C"],
        lootGoods: data.G.map(g => new Good(socket.client, g)),
        costsGoods: data.L.map(g => new Good(socket.client, g)),
        lostUnitsAmount: data["LU"],
        lostToolsAmount: data["LT"],
        attacksAmountWin: data["W"],
        attacksAmountDefeat: data["D"],
        attacksAmountPending: data["P"],
    }
}

module.exports = AttackAdvisorSummaryMessage;