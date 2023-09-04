const Unit = require("../Unit");
const BasicMovement = require("./BasicMovement");

class ConquerMovement extends BasicMovement {
    /**
     *
     * @param {Client} client
     * @param {object} data
     */
    constructor(client, data) {
        super(client, data);
        /** @type {InventoryItem<Unit>[]} */
        this.army = parse(client, data.A);
    }
}

/**
 *
 * @param {Client} client
 * @param {Array} data
 * @returns {InventoryItem<Unit>[]}
 */
function parse(client, data) {
    return data.map(d => {
        return {item: new Unit(client, d[0]), count: d[1]}
    })
}

module.exports = ConquerMovement;