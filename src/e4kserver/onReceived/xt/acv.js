module.exports.name = "acv";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{H:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    //todo: socket.client.clientUserData/*.allianceData*/.miniChatHidden = params.H === 1;
}