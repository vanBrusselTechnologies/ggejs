const {parseChatJSONMessage} = require("../tools/TextValide");

class ChatMessage {
    /**
     *
     * @param {Client} client
     * @param {{MT: string, MA: number, PID: number, PN: string}} data
     */
    constructor(client, data) {
        /** @type {string} */
        this.message = parseChatJSONMessage(data.MT);
        /** @type {Date} */
        this.sendDate = new Date(Date.now() - data.MA * 1000);
        /** @type {number} */
        this.senderPlayerId = data.PID;
        /** @type {string} */
        this.senderPlayerName = data.PN;
    }
}

module.exports = ChatMessage;