const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const {WaitUntil} = require("../../tools/wait");
const {execute: getTradeData} = require("../../commands/commands/getTradeData");

class MarketCarriageArrivedMessage extends BasicMessage {
    /** @type{Client}*/
    #client;

    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    parseMetaData(client, metaArray) {
        if (metaArray.length > 0) {
            this.areaName = metaArray[0];
        }
        this.subject = Localize.text(client, "dialog_tradeMessage_title");
        if (this.areaName) {
            this.senderName = this.areaName.toString() === "-24" ? Localize.text(client, "monthevents_expeditioncamp") : this.areaName;
        }

        this.setSenderToAreaName(this.areaName, this.areaType, this.kingdomId)
    }

    async init() {
        try {
            this.tradeData = await getMessageBody(this.#client, this.messageId);
            delete this.#client._socket[`mmn -> ${this.tradeData.messageId}`];
        } catch (e) {
            delete this.#client._socket[`mmn -> errorCode`];
        }
    }
}

/**
 * @param {Client} client
 * @param {number} messageId
 * @returns {Promise<TradeData>}
 */
async function getMessageBody(client, messageId) {
    try {
        client._socket['mmn -> errorCode'] = "";
        getTradeData(client, messageId);
        return await WaitUntil(client, `mmn -> ${messageId}`, `mmn -> errorCode`, 30000);
    } catch (e) {
        client._socket['mmn -> errorCode'] = "";
        throw e;
    }
}

module.exports = MarketCarriageArrivedMessage;