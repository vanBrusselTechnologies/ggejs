module.exports.name = "tle";
/**
 * @param {Socket} socket
 * @param {string} loginToken
 */
module.exports.execute = function (socket, loginToken) {
    const C2SRegisterOrLoginVO = {
        GST: socket.client.socketManager.serverType, TLT: loginToken, ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
    };
    socket.client.socketManager.sendCommand("tle", C2SRegisterOrLoginVO);
}