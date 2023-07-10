const BasicAllianceWarMessage = require("./BasicAllianceWarMessage");

class AllianceWarEnemyAttackMessage extends BasicAllianceWarMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.attackedPlayerId = parseInt(metaArray[1]);
        this.attackedPlayerName = metaArray[2];
    }
}

module.exports = AllianceWarEnemyAttackMessage;