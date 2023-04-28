const Unit = require("./Unit");
const InventoryItem = require('./InventoryItem');

class LogUnit extends InventoryItem {
    /**
     *
     * @param {Client} client
     * @param {number} unitWodId
     * @param {number} count
     * @param {number} lostCount
     */
    constructor(client, unitWodId, count, lostCount) {
        super(new Unit(client, unitWodId), count)
        this.lostCount = lostCount;
    }
}

module.exports = LogUnit;