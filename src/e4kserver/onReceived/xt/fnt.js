module.exports.name = "fnt";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{X:number, Y: number, gaa: Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const nextTower = new (require('../../../structures/CastlePosition'))();
    nextTower.kingdomId = 10;
    nextTower.xPos = params.X;
    nextTower.yPos = params.Y;
    client._socket["FACTION_NEXT_TOWER"] = nextTower;
}