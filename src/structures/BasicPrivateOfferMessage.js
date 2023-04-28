const BasicMessage = require("./BasicMessage");
const Localize = require("../tools/Localize");
class BasicPrivateOfferMessage extends BasicMessage {
    parseMetaData(client, metaArray)
    {
        this.subType = parseInt(metaArray[0]);
        this.senderName = Localize.text(client, "dialog_message_offerSystem");
    }
}

module.exports = BasicPrivateOfferMessage;