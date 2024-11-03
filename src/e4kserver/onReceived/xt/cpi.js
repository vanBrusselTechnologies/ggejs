module.exports.name = "cpi";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{MC:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.availablePlagueMonks = params.MC;
}