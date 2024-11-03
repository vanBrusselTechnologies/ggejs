module.exports.name = "gho";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    socket.client.clientUserData.userHonor = params["H"];
    socket.client.clientUserData.userRanking = params["RP"];
}
