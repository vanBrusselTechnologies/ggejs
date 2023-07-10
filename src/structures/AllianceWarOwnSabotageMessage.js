const BasicAllianceWarMessage = require("./BasicAllianceWarMessage");

class AllianceWarOwnSabotageMessage extends BasicAllianceWarMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.ownAllianceId = parseInt(metaArray[1]);
        this.ownAllianceName = metaArray[2];
    }
}

module.exports = AllianceWarOwnSabotageMessage;