const BasicAllianceWarMessage = require("./BasicAllianceWarMessage");

class AllianceWarOwnDeclarationMessage extends BasicAllianceWarMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.ownAllianceLeaderId = parseInt(metaArray[1]);
        this.ownAllianceLeaderName = metaArray[2];
    }
}

module.exports = AllianceWarOwnDeclarationMessage;