module.exports.name = "core_gpi";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{networkId: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    //todo: Below is not in source code. Check source code for actual
    if (!params || params.networkId === -1) return socket.end();
    socket.client._networkId = params.networkId
}