const BasicMapobject = require("./BasicMapobject");

class NomadKhanInvasionMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        if (data[3] > 0)
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        this.allianceCampId = data[4];
        if (data[5] > 0)
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        this.totalCooldown = data[6];
        this.skipCost = data[7];
        this.victoryCount = data[8];
        this.difficultyCampId = data[9];
        this.baseWallBonus = data[10];
        this.baseGateBonus = data[11];
        this.baseMoatBonus = data[12];
    }
    isVisibleOnMap = true;
    eventId = 72;
    travelDistance = 2;
}

module.exports = NomadKhanInvasionMapobject;