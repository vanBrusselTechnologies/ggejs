module.exports.name = "crm";
/**
 * @param {Socket} socket
 * @param {Mapobject} source
 * @param {Mapobject | CastlePosition} target
 * @param {["W" | "S" | "F" | "C" | "O" | "G" | "I" | "A" | "HONEY" | "MEAD", number][]} goods
 * @param {Horse} horse
 */
module.exports.execute = function (socket, source, target, goods, horse) {
    let C2SCreateMarketMovementVO = {
        getCmdId: "crm", params: {
            SID: source.objectId,
            TX: target.position.X,
            TY: target.position.Y,
            G: goods,
            HBW: horse?.wodId ?? -1,
            KID: source.kingdomId,
            PTT: horse?.isPegasusHorse ? 1 : 0,
            SD: 0,
        },
    }
    require('../data').sendCommandVO(socket, C2SCreateMarketMovementVO);
}