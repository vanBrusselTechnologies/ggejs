const Unit = require("./Unit");

class CompactArmy {
    armySize = 0;
    soldierCount = 0;
    toolCount = 0;

    /**
     * @param {Client} client
     * @param {Object} data
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
        this.supportTools = data.AST ? parse(client, data.AST) : [];
        /** @type {InventoryItem<Unit>[]} */
        this.finalWave = data.RW ? parse(client, data.RW) : [];
        for (let item of this.left) {
            let _count = item.count;
            this.armySize += _count;
            let _unit = item.item;
            if (_unit.isSoldier) this.soldierCount += _count; else this.toolCount += _count;
        }
        for (let item of this.middle) {
            let _count = item.count;
            this.armySize += _count;
            let _unit = item.item;
            if (_unit.isSoldier) this.soldierCount += _count; else this.toolCount += _count;
        }
        for (let item of this.right) {
            let _count = item.count;
            this.armySize += _count;
            let _unit = item.item;
            if (_unit.isSoldier) this.soldierCount += _count; else this.toolCount += _count;
        }
        for (let item of this.supportTools) {
            let _count = item.count;
            this.armySize += _count;
            let _unit = item.item;
            if (_unit.isSoldier) this.soldierCount += _count; else this.toolCount += _count;
        }
        for (let item of this.finalWave) {
            let _count = item.count;
            this.armySize += _count;
            let _unit = item.item;
            if (_unit.isSoldier) this.soldierCount += _count; else this.toolCount += _count;
        }
    }
}

/**
 * @param {Client} client
 * @param {number[][]} data
 * @returns {InventoryItem<Unit>[]}
 */
function parse(client, data) {
    return data.map(d => {
        return {item: new Unit(client, d[0]), count: d[1]}
    })
}

module.exports = CompactArmy;