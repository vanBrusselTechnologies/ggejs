module.exports.name = "msd";
/**
 * @param {Socket} socket
 * @param {string} minuteSkipType
 * @param {number} kingdomId
 * @param {number} xPos
 * @param {number} yPos
 * @param {number} mapId
 * @param {number} nodeId
 */
module.exports.execute = function (socket, minuteSkipType, kingdomId, xPos, yPos, mapId = -1, nodeId = -1) {
    const C2SMinuteSkipDungeonVO = {
        MST: minuteSkipType, KID: kingdomId.toString(), MID: mapId, NID: nodeId, X: xPos, Y: yPos
    };
    socket.client.socketManager.sendCommand("msd", C2SMinuteSkipDungeonVO);
}