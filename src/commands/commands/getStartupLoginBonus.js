module.exports.name = "sli";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SStartupLoginBonusVO = {};
    client.socketManager.sendCommand("sli", C2SStartupLoginBonusVO);
}