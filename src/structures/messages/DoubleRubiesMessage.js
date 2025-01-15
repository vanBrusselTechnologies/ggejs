const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");

class DoubleRubiesMessage extends BasicMessage {
    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);

        this.subject = Localize.text(client, "dialog_paymentdoubler_title");
        this.senderName = Localize.text(client, "dialog_messages_system");
    }
}

module.exports = DoubleRubiesMessage;