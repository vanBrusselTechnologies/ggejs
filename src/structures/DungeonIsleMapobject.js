const BasicMapobject = require("./BasicMapobject");

class DungeonIsleMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        this.kingdomId = data[3];
        if (data[4] > 0)
            this.lastSpyDate = new Date(Date.now() - data[4] * 1000);
        this.isleId = data[5];
        this.attackCount = data[7];
        this.isVisibleOnMap = data[8] <= 0;
        if (this.isVisibleOnMap) {
            if (data[6] > 0)
                this.attackCooldownEnd = new Date(Date.now() + data[6] * 1000);
        }
        else {
            if (data[6] > 0)
                this.reappearDate = new Date(Date.now() + data[6] * 1000);
        }
    }
}

module.exports = DungeonIsleMapobject;