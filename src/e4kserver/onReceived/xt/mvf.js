module.exports.name = "mvf";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{AF: number[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.activeMovementFilters = params.AF
}