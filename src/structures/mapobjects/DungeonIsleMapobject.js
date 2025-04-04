const InteractiveMapobject = require("./InteractiveMapobject");

class DungeonIsleMapobject extends InteractiveMapobject {
    occupierId = -223

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        if (data.length <= 3) return;
        this.ownerInfo = client.worldMaps._ownerInfoData.getOwnerInfo(this.occupierId);
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