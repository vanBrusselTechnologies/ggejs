const BasicSpecialEventMessage = require("./BasicSpecialEventMessage");
const Localize = require("../tools/Localize");
class SpecialEventStartMessage extends BasicSpecialEventMessage {
    parseMetaData(client, metaArray)
    {
        metaArray = metaArray[0].split("#");
        super.parseMetaData(client, metaArray);
        this.eventId = parseInt(metaArray[1]);
        this.subject = Localize.text(client, starterMail[this.eventId] || `event_title_${this.eventId}`);
    }
}

module.exports = SpecialEventStartMessage;

const starterMail = {
    4: "message_header_seaqueen_start",
    2: "message_header_thornking_start",
    64: "message_header_underworld_start",
    5: "message_header_invasion_start",
    71: "dialog_alienInvasion_message_header",
    3: "questSeriesID_3000",
    102: "message_island_reset_header",
    72: "message_header_invasion_start",
    500: "dialog_samuraiInvasion_title",
    83: "dialog_longPointsEvent_message_header",
    97: "message_header_shapeshifter_start",
    80: "dialog_samuraiInvasion_title",
    103: "dialog_redAlienInvasion_message_header",
    106: "message_header_outerrealms_start",
    110: "message_header_outerrealms_start",
    601: "message_header_seasonLeague_start"
}