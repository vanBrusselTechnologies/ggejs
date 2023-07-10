const BasicMessage = require("./BasicMessage");
const Localize = require("../tools/Localize");

class PlayerGiftMessage extends BasicMessage {
    parseMetaData(client, metaArray)
    {
        const metaArray2 = metaArray[0].split("#");
        this.senderId = parseInt(metaArray2[0]);
        this.senderName = metaArray2[1];
        this.packageId = parseInt(metaArray2[2]);
        this.packageAmount = parseInt(metaArray2[3]);
        this.subject = Localize.text(client, "message_giftReceived_header");
    }
}

module.exports = PlayerGiftMessage;