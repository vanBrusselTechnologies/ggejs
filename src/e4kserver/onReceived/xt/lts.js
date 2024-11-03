module.exports.name = "lts";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{LTS:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.lifeTimeSpent = params.LTS
}