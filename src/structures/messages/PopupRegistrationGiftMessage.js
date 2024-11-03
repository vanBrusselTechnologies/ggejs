const BasicPopupMessage = require("./BasicPopupMessage");
const Localize = require("../../tools/Localize");

class PopupRegistrationGiftMessage extends BasicPopupMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.isCollectable = parseInt(metaArray[1]) === 1;
        this.nextCollectableDayReward = parseInt(metaArray[2]);
        this.subject = Localize.text(client, "message_header_registerreward_title");
    }
}

module.exports = PopupRegistrationGiftMessage;