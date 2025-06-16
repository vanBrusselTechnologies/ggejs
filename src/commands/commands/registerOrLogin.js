module.exports.name = "tle";
/**
 * @param {Client} client
 * @param {string} loginToken
 */
module.exports.execute = function (client, loginToken) {
    const C2SRegisterOrLoginVO = {
        GST: client.socketManager.serverType, TLT: loginToken, ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
    };
    client.socketManager.sendCommand("tle", C2SRegisterOrLoginVO);
}