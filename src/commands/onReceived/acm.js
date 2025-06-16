const ChatMessage = require("../../structures/ChatMessage");

module.exports.name = "acm";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params || errorCode !== 0) return;
    const msg = new ChatMessage(client, params.CM);
    client.emit("chatMessage", msg);
}