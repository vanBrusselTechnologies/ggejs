module.exports.name = "bfs";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{T:number, RT:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.boostData.feast.setData(params);
}