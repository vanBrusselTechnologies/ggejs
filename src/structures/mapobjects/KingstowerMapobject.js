const BasicMapobject = require("./BasicMapobject");

class KingstowerMapobject extends BasicMapobject {
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
        this.kingdomId = data[5];
        if (data[6] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[6] * 1000);
        /** @type {string} */
        this.customName = data[7];
    }
}

module.exports = KingstowerMapobject;