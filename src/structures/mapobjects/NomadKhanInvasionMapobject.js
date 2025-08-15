const InvasionMapobject = require("./InvasionMapobject");

class NomadKhanInvasionMapobject extends InvasionMapobject {
    /**
     * @param {BaseClient} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        if (data.length <= 3) return;
        if (data[3] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        /** @type {number} */
        this.allianceCampId = data[4];
        if (data[5] > 0)
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        /** @type {number} */
        this.totalCooldown = data[6];
        /** @type {number} */
        this.skipCost = data[7];
        /** @type {number} */
        this.victoryCount = data[8];
        /** @type {number} */
        this.difficultyCampId = data[9];
        /** @type {number} */
        this.baseWallBonus = data[10];
        /** @type {number} */
        this.baseGateBonus = data[11];
        /** @type {number} */
        this.baseMoatBonus = data[12];
    }

    isVisibleOnMap = true;
    eventId = 72;
    travelDistance = 2;
}

module.exports = NomadKhanInvasionMapobject;