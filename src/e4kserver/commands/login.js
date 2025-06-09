let accountId = Date.now().toString() + (Math.random() * 999999).toFixed();

module.exports.aid = accountId;

module.exports.name = "core_lga";
/**
 * @param {Socket} socket
 * @param {string} name
 * @param {string} password
 */
module.exports.execute = function (socket, name, password) {
    const CoreC2SLoginWithAuthenticationVO = {
        NM: name, PW: password, L: socket.client._language, AID: accountId, DID: 5, PLFID: "3", /*Android = 3, iOs = 2, (PC = 1(?))*/
        ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
    };

    /* TODO Empire (?)
        params: {
            name: name,
            pw: password,
            did: (1).toString(),
            connectTime: (1).toString(),
            ping: (1).toString(),
            accountId: accountId.toString(),
        },
        getCmdId: "lgn"
        (e.name = l.BasicModel.userData.userName,
        e.pw = l.BasicModel.userData.loginPwd,
        e.lang = a.GGSCountryController.instance.currentCountry.ggsLanguageCode,
        e.did = s.EnvGlobalsHandler.globals.distributorId,
        e.connectTime = l.BasicModel.smartfoxClient.connectionTime,
        e.ping = l.BasicModel.smartfoxClient.roundTripTime,
        e.accountId = s.EnvGlobalsHandler.globals.accountId,
        r.BasicController.getInstance().sendServerMessageAndWait(o.BasicSmartfoxConstants.C2S_LOGIN, [JSON.stringify(e)], o.BasicSmartfoxConstants.C2S_LOGIN))
     */
    socket.client.socketManager.sendCommand("core_lga", CoreC2SLoginWithAuthenticationVO);
}