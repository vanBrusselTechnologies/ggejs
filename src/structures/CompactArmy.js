const Unit = require("./Unit");

class CompactArmy {
    armySize = 0;
    soldierCount = 0;
    toolCount = 0;
    constructor(client, data) {
        this.left = parse(client, data.L);
        this.middle = parse(client, data.M);
        this.right = parse(client, data.R);
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

function parse(client, obj) {
    let output = [];
    for (i in obj) {
        let _wodId = data[i][0];
        let _count = data[i][1];
        output.push({
            unit: new Unit(client, _wodId),
            count: _count,
        });
    }
    return output;
}

module.exports = CompactArmy;