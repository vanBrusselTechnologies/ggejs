class ChatMessage {
    /**
     * 
     * @param {Client} client 
     * @param {object} data 
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

/**
 * 
 * @param {string} msgText 
 * @returns {string}
 */
function parseChatJSONMessage(msgText) {
    if (!msgText) return "";
    return msgText.replace(/&percnt;/g, "%").replace(/&quot;/g, "\"").replace(/&#145;/g, "\'").replace(/<br \/>/g, "\n").replace(/&lt;/g, "<");
}

module.exports = ChatMessage;