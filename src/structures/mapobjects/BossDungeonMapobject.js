const InteractiveMapobject = require("./InteractiveMapobject");

class BossDungeonMapobject extends InteractiveMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0,3));
        if (data.length <= 3) return;
        if (data[3] !== -1)
        /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        /** @type {number} */
        this.dungeonLevel = data[4];
        if (data[5] > 0)
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        /** @type {number} */
        this.defeaterPlayerId = data[6];
        /** @type {number} */
        this.kingdomId = data[7];

        this.ownerInfo = client.worldmaps._ownerInfoData.getKingdomBossDungeonOwnerByKingdomId(this.kingdomId);
    }
}

module.exports = BossDungeonMapobject;