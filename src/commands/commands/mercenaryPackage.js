module.exports.name = "mpe";
/**
 * @param {Client} client
 * @param {number} missionId
 */
module.exports.execute = function (client, missionId) {
    if (client._socket["inMpeTimeout"]) return;
    const C2SMercenariesPackageVO = {MID: missionId};
    client.socketManager.sendCommand("mpe", C2SMercenariesPackageVO);
}