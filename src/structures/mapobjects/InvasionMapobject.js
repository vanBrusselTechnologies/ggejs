const InteractiveMapobject = require("./InteractiveMapobject");

class InvasionMapobject extends InteractiveMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0,3));
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
        this.wallLevel = 1;
        this.keepLevel = 1;
        this.gateLevel = 1;
        this.towerLevel = 1;
        this.moatLevel = 1;
        this.isVisibleOnMap = true;
    }
    eventId = 0;


    parseAreaInfoBattleLog(data){
        this.difficultyCampId = data.DDCID;
        return this;
    }
}

module.exports = InvasionMapobject;