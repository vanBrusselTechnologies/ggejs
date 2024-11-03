const InteractiveMapobject = require("./InteractiveMapobject");

class MonumentMapobject extends InteractiveMapobject {
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
        this.monumentType = data[5];
        /** @type {number} */
        this.monumentLevel = data[6];
        /** @type {number} */
        this.kingdomId = data[7];
        if (data[8] !== -1) /** @type {Date} */this.lastSpyDate = new Date(Date.now() - data[8] * 1000);
        /** @type {string} */
        this.customName = data[9];
    }
}

module.exports = MonumentMapobject;