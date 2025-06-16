module.exports.name = "msd";
/**
 * @param {Client} client
 * @param {string} minuteSkipType
 * @param {number} kingdomId
 * @param {number} xPos
 * @param {number} yPos
 * @param {number} mapId
 * @param {number} nodeId
 */
module.exports.execute = function (client, minuteSkipType, kingdomId, xPos, yPos, mapId = -1, nodeId = -1) {
    const C2SMinuteSkipDungeonVO = {
        MST: minuteSkipType, KID: kingdomId.toString(), MID: mapId, NID: nodeId, X: xPos, Y: yPos
    };
    client.socketManager.sendCommand("msd", C2SMinuteSkipDungeonVO);
}