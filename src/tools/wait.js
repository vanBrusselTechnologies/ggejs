const {ConnectionStatus} = require("../utils/Constants");
const _maxMS = 3600000;
const timeout = 1;

/**
 * Resolves when socket[field] is true, returning value of socket[field].
 * Rejects when socket[errorField] !== ""
 * @param {Socket} socket
 * @param {string} field
 * @param {string} errorField
 * @param {number} maxMs
 */
module.exports.WaitUntil = function (socket, field, errorField = "", maxMs = _maxMS) {
    return _WaitUntil(socket, field, errorField, new Date(Date.now() + maxMs).getTime());
}

/**
 * Resolves when socket[field] is true. Rejects when socket[errorField] !== ""
 * @param {Socket} socket
 * @param {string} field
 * @param {string} errorField
 * @param {number} endDateTimestamp
 * @private
 */
async function _WaitUntil(socket, field, errorField = "", endDateTimestamp) {
    const connStatus = socket.client.socketManager.connectionStatus;
    if (socket?._host == null) {
        throw `WaitUntil: Socket missing! field: ${field}, errorField: ${errorField}`;
    } else if (socket[field]) {
        return socket[field];
    } else if (errorField !== "" && socket[errorField] && socket[errorField] !== "") {
        throw socket[errorField];
    } else if (connStatus === ConnectionStatus.Disconnecting || connStatus === ConnectionStatus.Disconnected || socket.closed) {
        throw "Socket disconnected!";
    } else if (endDateTimestamp < Date.now()) {
        throw "Exceeded max time!";
    } else {
        await new Promise(resolve => setTimeout(resolve, timeout));
        return await _WaitUntil(socket, field, errorField, endDateTimestamp);
    }
}