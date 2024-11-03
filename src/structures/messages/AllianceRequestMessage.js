const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");

class AllianceRequestMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.allianceId = parseInt(metaArray[0]);
        this.allianceName = metaArray[1];
        this.subject = Localize.text(client, "dialog_alliance_invitationHeader");
        this.senderName = parseInt(this.allianceName) === -24 ? Localize.text(client, "monthevents_expeditioncamp") : this.allianceName;
    }
}

module.exports = AllianceRequestMessage;