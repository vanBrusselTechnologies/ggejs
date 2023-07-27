const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
class HighScoreBonusMessage extends BasicMessage {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.senderName = Localize.text(client, "dialog_messages_system");
        this.subject = Localize.text(client, "dialog_rankreward_message_title");
    }
}

module.exports = HighScoreBonusMessage;