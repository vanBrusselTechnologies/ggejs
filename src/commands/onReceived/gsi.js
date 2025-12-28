const Unit = require("../../structures/Unit");
const {InventoryItem} = require("../../structures/InventoryItem");

module.exports.name = "gsi";
/**
 * @param {BaseClient} client
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
 * @param {BaseClient} client
 * @param {[number, number][]} data
 * @return {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    return data.map(u => new InventoryItem(new Unit(client, u[0]), u[1]));
}