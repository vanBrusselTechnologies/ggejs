const BasicPrivateOfferMessage = require("./BasicPrivateOfferMessage");
const Localize = require("../../tools/Localize");

class PrivateOfferWhaleChestMessage extends BasicPrivateOfferMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        const metaArray2 = metaArray[1].split("#");
        this.privateOfferId = parseInt(metaArray2[0]);
        this.privateOfferIteration = parseInt(metaArray2[1]);
        this.subject = Localize.text(client, "dialog_privateOffer_whaleChest_header");
    }
}

module.exports = PrivateOfferWhaleChestMessage;