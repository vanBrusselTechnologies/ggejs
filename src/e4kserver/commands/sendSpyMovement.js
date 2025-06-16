module.exports.name = "csm";
/**
 * @param {Client} client
 * @param {InteractiveMapobject} source
 * @param {Mapobject | CastlePosition} target
 * @param {number} spyCount
 * @param {number} spyTypeId
 * @param {number} spyEffect
 * @param {Horse} horse
 */
module.exports.execute = function (client, source, target, spyCount, spyTypeId, spyEffect, horse = null) {
    const C2SCreateSpyMovementVO = {
        SID: source.objectId,
        TX: target.position.X,
        TY: target.position.Y,
        SC: spyCount,
        ST: spyTypeId,
        SE: spyEffect,
        HBW: horse?.wodId ?? -1,
        KID: source.kingdomId,
        PTT: horse?.isPegasusHorse ? 1 : 0,
        SD: 0,
    };
    client.socketManager.sendCommand("csm", C2SCreateSpyMovementVO);
}