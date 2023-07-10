const BasicAllianceWarMessage = require("./BasicAllianceWarMessage");

class AllianceWarOwnAttackMessage extends BasicAllianceWarMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.ownAllianceId = parseInt(metaArray[1]);
        this.ownAllianceName = metaArray[2];
    }
}

module.exports = AllianceWarOwnAttackMessage;