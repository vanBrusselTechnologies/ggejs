const InteractiveMapobject = require("./InteractiveMapobject");

class ShapeshifterMapobject extends InteractiveMapobject {
    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        if (data.length <= 3) return;
        /** @type {number} */
        this.kingdomId = data[3];
        /** @type {number} */
        this.ownerId = data[4];
        this.ownerInfo = client.worldMaps._ownerInfoData.getOwnerInfo(this.ownerId);
        if (data[5] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[5] * 1000);
        /** @type {number} */
        this.campLevel = data[6];
        /** @type {boolean} */
        this.playerAttacked = data[7] === 1;
        /** @type {boolean} */
        this.shapeshifterAttacked = data[8] === 1;
        /** @type {number} */
        this.shapeshifterId = data[9];
        /** @type {number} */
        this.keepLevel = data[10];
        /** @type {number} */
        this.wallLevel = data[11];
        /** @type {number} */
        this.gateLevel = data[12];
        /** @type {number} */
        this.towerLevel = data[13];
        /** @type {number} */
        this.moatLevel = data[14];
    }

    travelDistance = 150;
    eventId = 97;

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        this.equipmentId = 0;
        return this;
    }
}

module.exports = ShapeshifterMapobject;