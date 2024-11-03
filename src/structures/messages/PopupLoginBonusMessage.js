const BasicPopupMessage = require("./BasicPopupMessage");
const Localize = require("../../tools/Localize");

class PopupLoginBonusMessage extends BasicPopupMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.subject = Localize.text(client, "message_header_loginBonus_title");
    }
}

module.exports = PopupLoginBonusMessage;