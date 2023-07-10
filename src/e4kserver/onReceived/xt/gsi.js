const Unit = require("../../../structures/Unit");

module.exports = {
    name: "gsi",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        return {
            /** @type number */
            totalShadowUnits: params.T,
            /** @type number */
            travellingShadowUnits: params.TT,
            /** @type {InventoryItem<Unit>[]} */
            shadowUnits: parseUnits(socket.client, params.SI)
        }
    }
}

/**
 *
 * @param {Client} client
 * @param {[]} data
 * @return {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    let units = [];
    for (let u of data) {
        units.push({
            item: new Unit(client, u[0]),
            count: u[1]
        })
    }
    return units;
}