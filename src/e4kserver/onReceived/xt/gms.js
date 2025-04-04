module.exports.name = "gms";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{MS: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    socket.client.clientUserData.maxSpies = params.MS;
}