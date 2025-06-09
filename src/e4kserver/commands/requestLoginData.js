module.exports.name = "core_rld";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let accountId = Date.now().toString() + (Math.random() * 999999).toFixed();
    const CoreC2SRequestLoginDataVO = {
        AID: accountId, S: "local", SID: -1, DID: 5, PLFID: "3", ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
    };
    socket.client.socketManager.sendCommand("core_rld", CoreC2SRequestLoginDataVO);
}