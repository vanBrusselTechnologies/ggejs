const BasicPrivateOfferMessage = require("./BasicPrivateOfferMessage");
const Localize = require("../tools/Localize");

class PrivateOfferTippMessage extends BasicPrivateOfferMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        const metaArray2 = metaArray[1].split("#");
        this.helpMailImageId = parseInt(metaArray2[1]);
        this.helpMailTextId = parseInt(metaArray2[2]);
        this.subject = Localize.text(client, "dialog_messageTip_title_" + this.helpMailTextId);
    }
}

module.exports = PrivateOfferTippMessage;