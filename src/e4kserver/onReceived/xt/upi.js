module.exports.name = "upi"
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{PU: number, DC: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.isPayUser = params.PU === 1;
    socket.client.clientUserData.paymentDoublerCount = params.DC
}