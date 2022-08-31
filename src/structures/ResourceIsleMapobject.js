const BasicMapobject = require("./BasicMapobject");

class ResourceIsleMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
        this.objectId = data[3];
        this.occupierId = data[4];
        this.kingdomId = data[5];
        this.customName = data[6];
        if (data[7] > 0)
            this.lastSpyDate = new Date(Date.now() - data[7] * 1000);
        this.isleId = data[8];
        if (data[9] > 0)
            this.occupationFinishedDate = new Date(Date.now() + data[9] * 1000);
    }
}

module.exports = ResourceIsleMapobject;