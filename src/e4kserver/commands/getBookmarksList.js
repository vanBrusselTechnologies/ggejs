module.exports.name = "gbl";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SBookmarkGetListVO = {};
    client.socketManager.sendCommand("gbl", C2SBookmarkGetListVO);
}