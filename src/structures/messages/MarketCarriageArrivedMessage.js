const BasicMessage = require("./BasicMessage");
const {marketCarriageNotify} = require("../../commands/mmn");
const EmpireError = require("../../tools/EmpireError");
const Localize = require("../../tools/Localize");

class MarketCarriageArrivedMessage extends BasicMessage {
    /** @type{BaseClient}*/
    #client;
    /** @type {TradeData | undefined} */
    _tradeData = undefined;

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

    async getTradeData() {
        try {
            if (this._tradeData !== undefined) return this._tradeData;
            this._tradeData = await marketCarriageNotify(this.#client, this.messageId);
            return this._tradeData;
        } catch (e) {
            throw new EmpireError(this.#client, e);
        }
    }
}

module.exports = MarketCarriageArrivedMessage;