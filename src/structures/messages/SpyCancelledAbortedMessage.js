const AttackCancelledAbortedMessage = require("./AttackCancelledAbortedMessage");
const Localize = require("../../tools/Localize");

class SpyCancelledAbortedMessage extends AttackCancelledAbortedMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.subject = Localize.text(client, "spyWarning_warning");
    }
}

module.exports = SpyCancelledAbortedMessage;