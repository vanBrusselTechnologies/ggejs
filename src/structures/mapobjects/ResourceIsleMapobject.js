const InteractiveMapobject = require("./InteractiveMapobject");

class ResourceIsleMapobject extends InteractiveMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        if (data.length <= 3) return;
        /** @type {number} */
        this.objectId = data[3];
        /** @type {number} */
        this.occupierId = data[4];
        if (this.occupierId >= 0) this.ownerInfo = client.worldmaps._ownerInfoData.getOwnerInfo(this.occupierId);
        /** @type {number} */
        this.kingdomId = data[5];
        /** @type {string} */
        this.customName = data[6];
        if (data[7] > 0) /** @type {Date} */this.lastSpyDate = new Date(Date.now() - data[7] * 1000);
        /** @type {number} */
        this.isleId = data[8];
        if (data[9] > 0) /** @type {Date} */this.occupationFinishedDate = new Date(Date.now() + data[9] * 1000);
    }
}

module.exports = ResourceIsleMapobject;