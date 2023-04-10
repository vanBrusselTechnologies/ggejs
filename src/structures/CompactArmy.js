const Unit = require("./Unit");

class CompactArmy {
    armySize = 0;
    soldierCount = 0;
    toolCount = 0;
    /**
     * 
     * @param {Client} client 
     * @param {object} data 
     * @returns 
     */
    constructor(client, data) {
        if (!data) return;
        /** @type {InventoryItem<Unit>[]} */
        this.left = parse(client, data.L);
        /** @type {InventoryItem<Unit>[]} */
        this.middle = parse(client, data.M);
        /** @type {InventoryItem<Unit>[]} */
        this.right = parse(client, data.R);
        /** @type {InventoryItem<Tool>[]} */
        this.supportTools = parse(client, data.AST);
        for (let i in this.left) {
            let _count = this.left[i].count;
            this.armySize += _count;
            let _unit = this.left[i].item;
            if (_unit.isSoldier)
                this.soldierCount += _count;
            else
                this.toolCount += _count;
        }
        for (let i in this.middle) {
            let _count = this.middle[i].count;
            this.armySize += _count;
            let _unit = this.middle[i].item;
            if (_unit.isSoldier)
                this.soldierCount += _count;
            else
                this.toolCount += _count;
        }
        for (let i in this.right) {
            let _count = this.right[i].count;
            this.armySize += _count;
            let _unit = this.right[i].item;
            if (_unit.isSoldier)
                this.soldierCount += _count;
            else
                this.toolCount += _count;
        }
        for (let i in this.supportTools) {
            let _count = this.supportTools[i].count;
            this.armySize += _count;
            let _unit = this.supportTools[i].item;
            if (_unit.isSoldier)
                this.soldierCount += _count;
            else
                this.toolCount += _count;
        }
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {InventoryItem<Unit>[]}
 */
function parse(client, data) {
    /** @type {InventoryItem<Unit>[]} */
    let output = [];
    for (let i in data) {
        /** @type {number} */
        let _wodId = data[i][0];
        /** @type {number} */
        let _count = data[i][1];
        output.push({
            item: new Unit(client, _wodId),
            count: _count,
        });
    }
    return output;
}

module.exports = CompactArmy;