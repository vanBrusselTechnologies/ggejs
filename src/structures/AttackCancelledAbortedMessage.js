const BasicAttackCancelledMessage = require("./BasicAttackCancelledMessage");

class AttackCancelledAbortedMessage extends BasicAttackCancelledMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.areaType = parseInt(metaArray[6]);
        this.reason = parseInt(metaArray[7]);
    }
}

module.exports = AttackCancelledAbortedMessage;