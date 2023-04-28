const InventoryItem = require("./InventoryItem");

class BattleLogUnit extends InventoryItem {
    /**
     *
     * @param {Unit} unit
     * @param {number} count
     * @param {number} lost
     */
    constructor(unit, count, lost) {
        super(unit, count);
        this.lost = lost;
    }
}

module.exports = BattleLogUnit;