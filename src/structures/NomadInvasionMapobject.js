const BasicMapobject = require("./BasicMapobject");

class NomadInvasionMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        if (data[3] > 0)
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        this.victoryCount = data[4];
        if (data[5] > 0)
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        this.difficultyCampId = data[8];
        this.baseWallBonus = data[9];
        this.baseGateBonus = data[10];
        this.baseMoatBonus = data[11];
    }
    isVisibleOnMap = true;
    eventId = 72;
    travelDistance = 2;
}

module.exports = NomadInvasionMapobject;