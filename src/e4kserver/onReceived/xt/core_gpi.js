module.exports.name = "core_gpi";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{networkId: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    // TODO: Below is not in source code. Check source code for actual
    if (!params || params.networkId === -1) return client.socketManager.socket.end();
    client._networkId = params.networkId
}