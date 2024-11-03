module.exports.name = "mrm";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    socket.client.movements._remove(params.MID);
}