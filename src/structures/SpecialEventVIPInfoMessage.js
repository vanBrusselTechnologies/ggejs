const BasicSpecialEventMessage = require("./BasicSpecialEventMessage");
const Localize = require("../tools/Localize");

class SpecialEventVIPInfoMessage extends BasicSpecialEventMessage {
    parseMetaData(client, metaArray) {
        metaArray = metaArray[0].split("#");
        super.parseMetaData(client, metaArray);
        this.vipLevel = parseInt(metaArray[1]);
        this.subject = Localize.text(client, "dialog_VipBonus_message_header", this.vipLevel);
        this.senderName = Localize.text(client, "dialog_messages_system");
    }
}

module.exports = SpecialEventVIPInfoMessage;