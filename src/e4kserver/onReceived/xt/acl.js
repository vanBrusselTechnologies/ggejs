const {execute: acv} = require('./acv');
const ChatMessage = require("../../../structures/ChatMessage");

module.exports.name = "acl";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{CM:[], acv: {H:number}}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    acv(socket, errorCode, params.acv);
    const client = socket.client;
    const msgs = params.CM;
    for (let m of msgs) {
        const msg = new ChatMessage(client, m);
        client.emit("chatMessage", msg);
    }
}