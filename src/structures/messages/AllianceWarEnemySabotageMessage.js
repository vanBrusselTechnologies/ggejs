const BasicAllianceWarMessage = require("./BasicAllianceWarMessage");

class AllianceWarEnemySabotageMessage extends BasicAllianceWarMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.sabotagedPlayerId = parseInt(metaArray[1]);
        this.sabotagedPlayerName = metaArray[2];
    }
}

module.exports = AllianceWarEnemySabotageMessage;