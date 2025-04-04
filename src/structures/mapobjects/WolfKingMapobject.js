const InteractiveMapobject = require("./InteractiveMapobject");

class WolfKingMapobject extends InteractiveMapobject {
    travelDistance = 2;

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0,3));
        if (data[3] > 0)
        this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        this.level = data[4];
        this.isDefeated = data[5] === 1;
        this.isVisibleOnMap = !this.isDefeated;
        this.baseWallBonus = data[6];
        this.baseGateBonus = data[7];
        this.baseMoatBonus = data[8];
    }
}

module.exports = WolfKingMapobject;