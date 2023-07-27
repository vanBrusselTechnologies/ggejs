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
 * @param {Array} obj 
 * @returns {InventoryItem<Unit>[]}
 */
function parse(client, obj) {
    /** @type {InventoryItem<Unit>[]} */
    let output = [];
    for (let i in obj) {
        output.push({
            item: new Unit(client, obj[i][0]),
            count: obj[i][1],
        });
    }
    return output;
}

module.exports = ConquerMovement;