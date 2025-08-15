const {execute: acv} = require('./acv');
const ChatMessage = require("../../structures/ChatMessage");

module.exports.name = "acl";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{CM:[], acv: {H:number}}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    acv(client, errorCode, params.acv);
    const msgs = params.CM;
    for (let m of msgs) {
        const msg = new ChatMessage(client, m);
        client.emit("chatMessage", msg);
    }
}