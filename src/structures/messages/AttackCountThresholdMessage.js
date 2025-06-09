const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");

class AttackCountThresholdMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.subject = Localize.text(client, "title_attack_threshold");
        this.senderName = Localize.text(client, "dialog_messages_system");
    }
}

module.exports = AttackCountThresholdMessage;