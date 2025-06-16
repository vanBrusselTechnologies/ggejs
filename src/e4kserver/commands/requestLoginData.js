module.exports.name = "core_rld";
/** @param {Client} client */
module.exports.execute = function (client) {
    let accountId = Date.now().toString() + (Math.random() * 999999).toFixed();
    const CoreC2SRequestLoginDataVO = {
        AID: accountId, S: "local", SID: -1, DID: 5, PLFID: "3", ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
    };
    client.socketManager.sendCommand("core_rld", CoreC2SRequestLoginDataVO);
}