const BasicPrivateOfferMessage = require("./BasicPrivateOfferMessage");
const Localize = require("../../tools/Localize");

class PrivateOfferBestsellerShopMessage extends BasicPrivateOfferMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        const metaArray2 = metaArray[1].split("#");
        this.privateOfferId = parseInt(metaArray2[0]);
        this.privateOfferIteration = parseInt(metaArray2[1]);
        this.subject = Localize.text(client, "dialog_privateBestsellerShop_title");
    }
}

module.exports = PrivateOfferBestsellerShopMessage;