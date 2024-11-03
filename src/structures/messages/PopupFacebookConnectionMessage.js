const BasicPopupMessage = require("./BasicPopupMessage");
const Localize = require("../../tools/Localize");

class PopupFacebookConnectionMessage extends BasicPopupMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.subject = Localize.text(client, "message_header_fbConnectNow_title");
    }
}

module.exports = PopupFacebookConnectionMessage;