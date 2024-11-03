module.exports.name = "tle";
/**
 * @param {Socket} socket
 * @param {string} loginToken
 */
module.exports.execute = function (socket, loginToken) {
    let C2SRegisterOrLoginVO = {
        getCmdId: "tle", params: {
            GST: socket["currentServerType"], TLT: loginToken, ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
        }
    }
    require('../data').sendCommandVO(socket, C2SRegisterOrLoginVO);
}