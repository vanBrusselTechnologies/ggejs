const InteractiveMapobject = require("./InteractiveMapobject");

class KingstowerMapobject extends InteractiveMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0,3));
        if (data.length <= 3) return;
        /** @type {number} */
        this.objectId = data[3];
        /** @type {number} */
        this.ownerId = data[4];
        this.ownerInfo = client.worldmaps._ownerInfoData.getOwnerInfo(this.ownerId);
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