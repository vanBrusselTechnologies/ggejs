module.exports.name = "core_rld";
/**
 * @param {Socket} socket
 */
module.exports.execute = function (socket) {
    let accountId = Date.now().toString() + (Math.random() * 999999).toFixed();
    let CoreC2SRequestLoginDataVO = {
        getCmdId: "core_rld", params: {
            AID: accountId, S: "local", SID: -1, DID: 5, PLFID: "3", ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
        },
    }
    require('../data').sendCommandVO(socket, CoreC2SRequestLoginDataVO);
}