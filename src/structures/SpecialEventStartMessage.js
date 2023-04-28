const BasicSpecialEventMessage = require("./BasicSpecialEventMessage");
const Localize = require("../tools/Localize");
class SpecialEventStartMessage extends BasicSpecialEventMessage {
    parseMetaData(client, metaArray)
    {
        metaArray = metaArray[0].split("#");
        super.parseMetaData(client, metaArray);
        this.eventId = parseInt(metaArray[1]);
        this.subject = Localize.text(client, `event_title_${this.eventId}`);
    }
}

module.exports = SpecialEventStartMessage;