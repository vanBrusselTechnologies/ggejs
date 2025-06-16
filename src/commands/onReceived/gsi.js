const Unit = require("../../structures/Unit");

module.exports.name = "gsi";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{T:number, TT: number, SI: [number, number][]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    return {
        totalShadowUnits: params.T,
        travellingShadowUnits: params.TT,
        shadowUnits: parseUnits(client, params.SI)
    };
}

/**
 * @param {Client} client
 * @param {[number, number][]} data
 * @return {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    const units = [];
    for (let u of data) {
        units.push({item: new Unit(client, u[0]), count: u[1]})
    }
    return units;
}