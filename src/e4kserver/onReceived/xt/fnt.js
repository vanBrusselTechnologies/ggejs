module.exports.name = "fnt";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{X:number, Y: number, gaa: Object}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const nextTower = new (require('../../../structures/CastlePosition'))();
    nextTower.kingdomId = 10;
    nextTower.xPos = params.X;
    nextTower.yPos = params.Y;
    socket["FACTION_NEXT_TOWER"] = nextTower;
}