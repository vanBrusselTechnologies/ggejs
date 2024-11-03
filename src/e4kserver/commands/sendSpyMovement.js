module.exports.name = "csm"
/**
 * @param {Socket} socket
 * @param {InteractiveMapobject | CastlePosition} source
 * @param {Mapobject} target
 * @param {number} spyCount
 * @param {number} spyTypeId
 * @param {number} spyEffect
 * @param {Horse} horse
 */
module.exports.execute = function (socket, source, target, spyCount, spyTypeId, spyEffect, horse = null) {
    let C2SSendMessageVO = {
        getCmdId: "csm", params: {
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
        },
    }
    require('../data').sendCommandVO(socket, C2SSendMessageVO);
}