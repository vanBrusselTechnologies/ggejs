const BasicSpecialEventMessage = require("./BasicSpecialEventMessage");
const Localize = require("../../tools/Localize");

class SpecialEventEndMessage extends BasicSpecialEventMessage {
    parseMetaData(client, metaArray) {
        metaArray = metaArray[0].split("#");
        super.parseMetaData(client, metaArray);
        this.eventId = parseInt(metaArray[1]);
        if (this.eventId === 102) this.subject = Localize.text(client, "dialog_island_mail_reminder_title");
    }
}

module.exports = SpecialEventEndMessage;