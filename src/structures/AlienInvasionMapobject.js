const BasicMapobject = require("./BasicMapobject");

class AlienInvasionMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        if(data.length <= 3) return;
        this.dungeonLevel = data[3];
        this.hasPeaceMode = data[5] === 1;
        this.wallLevel = data[6];
        this.gateLevel = data[7];
        this.moatLevel = data[8];
        this.wasRerolled = data[9] === 1;
        if (data[4] > 0)
            this.lastSpyDate = new Date(Date.now() - data[4] * 1000);
    }
    travelDistance = 50;
    eventId = 71;
}

module.exports = AlienInvasionMapobject;