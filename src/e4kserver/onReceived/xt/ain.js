const MyAlliance = require("./../../../structures/MyAlliance");
const Alliance = require('./../../../structures/Alliance');

module.exports.name = "ain";

/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{A:Object}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode === 114 || !params || !params.A) return;
    let alliance = (params.A.A !== null && params.A.A !== undefined) ? new MyAlliance(socket.client, params.A) : new Alliance(socket.client, params.A);
    socket[`_alliance_${alliance.allianceId}_data`] = alliance;
}