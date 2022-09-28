const BasicMapobject = require("./BasicMapobject");

class ResourceIsleMapobject extends BasicMapobject {
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
        this.kingdomId = data[5];
        /** @type {string} */
        this.customName = data[6];
        if (data[7] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[7] * 1000);
        /** @type {number} */
        this.isleId = data[8];
        if (data[9] > 0)
            /** @type {Date} */
            this.occupationFinishedDate = new Date(Date.now() + data[9] * 1000);
    }
}

module.exports = ResourceIsleMapobject;