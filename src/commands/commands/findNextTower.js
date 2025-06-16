module.exports.name = "fnt";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SFindNextTowerVO = {};
    client.socketManager.sendCommand("fnt", C2SFindNextTowerVO);
}