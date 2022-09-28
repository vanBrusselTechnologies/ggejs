const BasicMapobject = require("./BasicMapobject");

class NomadInvasionMapobject extends BasicMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        if (data[3] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        /** @type {number} */
        this.victoryCount = data[4];
        if (data[5] > 0)
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        /** @type {number} */
        this.difficultyCampId = data[8];
        /** @type {number} */
        this.baseWallBonus = data[9];
        /** @type {number} */
        this.baseGateBonus = data[10];
        /** @type {number} */
        this.baseMoatBonus = data[11];
    }
    isVisibleOnMap = true;
    eventId = 72;
    travelDistance = 2;
}

module.exports = NomadInvasionMapobject;