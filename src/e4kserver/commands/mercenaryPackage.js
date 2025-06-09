module.exports.name = "mpe";
/**
 * @param {Socket} socket
 * @param {number} missionId
 */
module.exports.execute = function (socket, missionId) {
    if (socket["inMpeTimeout"]) return;
    const C2SMercenariesPackageVO = {MID: missionId};
    socket.client.socketManager.sendCommand("mpe", C2SMercenariesPackageVO);
}