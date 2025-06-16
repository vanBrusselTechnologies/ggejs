const {ConnectionStatus} = require("../utils/Constants");
const _maxMS = 3600000;

/**
 * Resolves when socket[field] is true, returning value of socket[field].
 * Rejects when socket[errorField] !== ""
 * @param {Client} client
 * @param {string} field
 * @param {string} errorField
 * @param {number} maxMs
 */
module.exports.WaitUntil = function (client, field, errorField = "", maxMs = _maxMS) {
    return _WaitUntil(client, client._socket, field, errorField, new Date(Date.now() + maxMs).getTime());
}

/**
 * Resolves when socket[field] is true. Rejects when socket[errorField] !== ""
 * @param {Client} client
 * @param {net.Socket} socket
 * @param {string} field
 * @param {string} errorField
 * @param {number} endDateTimestamp
 * @private
 */
async function _WaitUntil(client, socket, field, errorField = "", endDateTimestamp) {
    if (socket[field]) return socket[field];
    if (errorField !== "" && socket[errorField] && socket[errorField] !== "") throw socket[errorField];

    const connStatus = client.socketManager.connectionStatus;
    if (connStatus === ConnectionStatus.Disconnecting || connStatus === ConnectionStatus.Disconnected || socket.closed) throw "Socket disconnected!";

    if (endDateTimestamp < Date.now()) throw "Exceeded max time!";

    await new Promise(resolve => setTimeout(resolve, 1));
    return await _WaitUntil(client, socket, field, errorField, endDateTimestamp);
}