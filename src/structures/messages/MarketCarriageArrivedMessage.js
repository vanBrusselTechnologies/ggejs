const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const {marketCarriageNotify} = require("../../commands/mmn");

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
        this.tradeData = await marketCarriageNotify(this.#client, this.messageId);
    }
}

module.exports = MarketCarriageArrivedMessage;