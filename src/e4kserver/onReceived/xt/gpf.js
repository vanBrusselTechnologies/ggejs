module.exports.name = "gpf"
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.hasPremiumFlag = params["PF"] === 1 || params["PF"];
}