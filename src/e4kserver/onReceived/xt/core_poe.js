const PrimeTime = require("../../../structures/PrimeTime");
const {Events} = require("../../../utils/Constants");

module.exports.name = "core_poe";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.emit(Events.PRIME_TIME, new PrimeTime(socket.client, params));
}