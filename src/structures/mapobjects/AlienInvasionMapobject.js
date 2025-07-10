const InteractiveMapobject = require("./InteractiveMapobject");

class AlienInvasionMapobject extends InteractiveMapobject {
    travelDistance = 50;
    eventId = 71;

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0,3));
        if (data.length <= 3) return;
        /** @type {number} */
        this.dungeonLevel = data[3];
        this.ownerInfo.paragonLevel = this._dungeonLevel >= 70 ? 1: 0;
        /** @type {boolean} */
        this.hasPeaceMode = data[5] === 1;
        /** @type {number} */
        this.wallLevel = data[6];
        /** @type {number} */
        this.gateLevel = data[7];
        /** @type {number} */
        this.moatLevel = data[8];
        /** @type {boolean} */
        this.wasRerolled = data[9] === 1;
        if (data[4] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[4] * 1000);
    }

    /** @param {Object} data */
    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        this._dungeonLevel = data.DL;
        return this;
    }
}

module.exports = AlienInvasionMapobject;