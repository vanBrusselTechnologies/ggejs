const BasicSpecialEventMessage = require("./BasicSpecialEventMessage");
const Localize = require("../../tools/Localize");

class SpecialEventHospitalCapacityExceededMessage extends BasicSpecialEventMessage {
    parseMetaData(client, metaArray) {
        this.capacity = parseInt(metaArray[0]);
        this.subject = Localize.text(client, "dialog_messageTip_title_13");
        this.senderName = Localize.text(client, "dialog_messages_system");
    }
}

module.exports = SpecialEventHospitalCapacityExceededMessage;