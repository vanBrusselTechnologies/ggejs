const ChatMessage = require("../../../structures/ChatMessage");

module.exports.name = "acm";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params || errorCode !== 0) return;
    const msg = new ChatMessage(socket.client, params.CM);
    socket.client.emit("chatMessage", msg);
}