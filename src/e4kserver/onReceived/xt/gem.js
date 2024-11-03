const Crest = require("../../../structures/Crest");

module.exports.name = "gem";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.mayChangeCrest = params["MCE"] === 1;
    socket.client.clientUserData.playerCrest = new Crest(socket.client, params);
}