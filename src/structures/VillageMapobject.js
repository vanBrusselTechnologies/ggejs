const BasicMapobject = require("./BasicMapobject");

class VillageMapobject extends BasicMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        /** @type {number} */
        this.objectId = data[3];
        /** @type {number} */
        this.occupierId = data[4];
        /** @type {number} */
        this.villageType = data[5];
        /** @type {number} */
        this.kingdomId = data[6];
        if (data[7] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[7] * 1000);
        /** @type {string} */
        this.customName = data[8];
    }
}

module.exports = VillageMapobject;