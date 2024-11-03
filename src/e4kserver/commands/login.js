let accountId = Date.now().toString() + (Math.random() * 999999).toFixed();

module.exports.aid = accountId;

module.exports.name = "core_lga";
/**
 * @param {Socket} socket
 * @param {string} name
 * @param {string} password
 */
module.exports.execute = function (socket, name, password) {
    let CoreC2SLoginWithAuthenticationVO = {
        getCmdId: "core_lga", params: {
            NM: name, PW: password, L: socket.client._language, AID: accountId, DID: 5, PLFID: "3", //Android = 3, iOs = 2, (PC = 1(?))
            ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
        },
    }
    require('../data').sendCommandVO(socket, CoreC2SLoginWithAuthenticationVO);
}