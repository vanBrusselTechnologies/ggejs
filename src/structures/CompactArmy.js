const Unit = require("./Unit");
const Client = require('./../Client');

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
        /** @type {{ unit: Unit, count: number }[]} */
        this.left = parse(client, data.L);
        /** @type {{ unit: Unit, count: number }[]} */
        this.middle = parse(client, data.M);
        /** @type {{ unit: Unit, count: number }[]} */
        this.right = parse(client, data.R);
        /** @type {{ unit: Unit, count: number }[]} */
        this.supportTools = parse(client, data.AST);
        for (i in this.left) {
            let _count = this.left[i].count;
            this.armySize += _count;
            let _unit = this.left[i].unit;
            if (_unit.isSoldier)
                this.soldierCount += _count;
            else
                this.toolCount += _count;
        }
        for (i in this.middle) {
            let _count = this.middle[i].count;
            this.armySize += _count;
            let _unit = this.middle[i].unit;
            if (_unit.isSoldier)
                this.soldierCount += _count;
            else
                this.toolCount += _count;
        }
        for (i in this.right) {
            let _count = this.right[i].count;
            this.armySize += _count;
            let _unit = this.right[i].unit;
            if (_unit.isSoldier)
                this.soldierCount += _count;
            else
                this.toolCount += _count;
        }
        for (i in this.supportTools) {
            let _count = this.supportTools[i].count;
            this.armySize += _count;
            let _unit = this.supportTools[i].unit;
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
 * @returns {{ unit: Unit, count: number }[]}
 */
function parse(client, data) {
    /** @type {{ unit: Unit, count: number }[]} */
    let output = [];
    for (let i in data) {
        /** @type {number} */
        let _wodId = data[i][0];
        /** @type {number} */
        let _count = data[i][1];
        output.push({
            unit: new Unit(client, _wodId),
            count: _count,
        });
    }
    return output;
}

module.exports = CompactArmy;