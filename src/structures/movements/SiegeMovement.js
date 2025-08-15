const Unit = require("../Unit");
const BasicMovement = require("./BasicMovement");

class SiegeMovement extends BasicMovement {
    /**
     * @param {BaseClient} client
     * @param {Object} data
     */
    constructor(client, data) {
        super(client, data);
        /** @type {InventoryItem<Unit>[]} */
        this.army = parse(client, data.A);
    }
}

/**
 * @param {BaseClient} client
 * @param {number[][]} data
 * @returns {InventoryItem<Unit>[]}
 */
function parse(client, data) {
    return data.map(d => {
        return {item: new Unit(client, d[0]), count: d[1]}
    })
}

module.exports = SiegeMovement;