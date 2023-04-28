const BasicMapobject = require("./BasicMapobject");

class DungeonIsleMapobject extends BasicMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        if (data.length <= 3) return;
        /** @type {number} */
        this.kingdomId = data[3];
        if (data[4] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[4] * 1000);
        /** @type {number} */
        this.isleId = data[5];
        /** @type {number} */
        this.attackCount = data[7];
        /** @type {boolean} */
        this.isVisibleOnMap = data[8] <= 0;
        if (data[6] > 0)
            if (this.isVisibleOnMap)
                /** @type {Date} */
                this.attackCooldownEnd = new Date(Date.now() + data[6] * 1000);

            else
                /** @type {Date} */
                this.reappearDate = new Date(Date.now() + data[6] * 1000);
    }
}

module.exports = DungeonIsleMapobject;