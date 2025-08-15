module.exports.name = "afd";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SGetAttackableFactionDataVO = {};
    client.socketManager.sendCommand("afd", C2SGetAttackableFactionDataVO);
}