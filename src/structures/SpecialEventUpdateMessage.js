const BasicSpecialEventMessage = require("./BasicSpecialEventMessage");
const Localize = require("../tools/Localize");

class SpecialEventUpdateMessage extends BasicSpecialEventMessage {
    parseMetaData(client, metaArray) {
        metaArray = metaArray[0].split("#");
        super.parseMetaData(client, metaArray);
        this.eventId = parseInt(metaArray[1]);
        this.metadata = metaArray;
        this.subject = Localize.text(client, updateMail[this.eventId]) || "";
    }
}

module.exports = SpecialEventUpdateMessage;

const updateMail = {
    97: "dialog_shapeshifterDaily_mailHeader",
    110: "message_header_outerrealms_start",
}