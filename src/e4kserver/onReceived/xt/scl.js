const ConstructionSlot = require("../../../structures/ConstructionSlot");

module.exports.name = "scl";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{OIDL: []}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    return params.OIDL.map(cs => new ConstructionSlot(socket.client, cs))
}