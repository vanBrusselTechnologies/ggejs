const BasicPrivateOfferMessage = require("./BasicPrivateOfferMessage");
const Localize = require("../../tools/Localize");

class PrivateOfferTippMessage extends BasicPrivateOfferMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.helpMailImageId = parseInt(metaArray[1]);
        this.helpMailTextId = parseInt(metaArray[2]);
        this.subject = Localize.text(client, `dialog_messageTip_title_${this.helpMailTextId}`);
    }
}

module.exports = PrivateOfferTippMessage;