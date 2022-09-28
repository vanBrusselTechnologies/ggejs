const BasicMapobject = require("./BasicMapobject");

class InteractiveMapobject extends BasicMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        if (data.length <= 3) return;
        /** @type {number} */
        this.objectId = data[3];
        /** @type {number} */
        this.ownerId = data[4];
        /** @type {number} */
        this.keepLevel = data[5];
        /** @type {number} */
        this.wallLevel = data[6];
        /** @type {number} */
        this.gateLevel = data[7];
        /** @type {number} */
        this.towerLevel = data[8];
        /** @type {number} */
        this.moatLevel = data[9];
        /** @type {string} */
        this.customName = data[10];
        if (data[11] > 0)
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[11] * 1000);
        if (data[12] > 0)
            /** @type {Date} */
            this.sabotageCooldownEnd = new Date(Date.now() + data[12] * 1000);
        if (data[13] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[13] * 1000);
        /** @type {number} */
        this.outpostType = data[14];
        /** @type {number} */
        this.occupierId = data[15];
        /** @type {number} */
        this.kingdomId = data[16];
        /** @type {number} */
        this.equipmentId = data[17];
    }
}

module.exports = InteractiveMapobject;