const ChatMessage = require("./../../../structures/ChatMessage");

module.exports.name = "acl";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{CM:[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const client = socket.client;
    const msgs = params.CM;
    for (let m of msgs) {
        const msg = new ChatMessage(socket.client, m);
        client.emit("chatMessage", msg);
    }
}