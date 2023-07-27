const BasicSpecialEventMessage = require("./BasicSpecialEventMessage");
const Localize = require("../../tools/Localize");

class SpecialEventMonumentResetMessage extends BasicSpecialEventMessage {
    parseMetaData(client, metaArray) {
        metaArray = metaArray[0].split("#");
        super.parseMetaData(client, metaArray);
        this.subject = Localize.text(client, "dialog_monument_resetMessage_title");
        this.senderName = Localize.text(client, "dialog_messages_system");
    }
}

module.exports = SpecialEventMonumentResetMessage;