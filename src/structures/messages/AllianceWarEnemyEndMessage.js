const BasicAllianceWarMessage = require("./BasicAllianceWarMessage");
const Localize = require("../../tools/Localize");

class AllianceWarEnemyEndMessage extends BasicAllianceWarMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.ownAllianceId = parseInt(metaArray[1]);
        this.ownAllianceName = metaArray[2];
        this.subject = Localize.text(client, "dialog_allianceDiplomacy_peaceOffer_title");
    }
}

module.exports = AllianceWarEnemyEndMessage;