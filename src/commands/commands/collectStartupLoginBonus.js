module.exports.name = "slc";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SStartupLoginBonusCollectVO = {};
    client.socketManager.sendCommand("slc", C2SStartupLoginBonusCollectVO);
}