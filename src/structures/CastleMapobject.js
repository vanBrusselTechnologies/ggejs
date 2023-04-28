const InteractiveMapobject = require("./InteractiveMapobject");

class CastleMapobject extends InteractiveMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        if (data.length <= 4) {
            super(client, data.slice(0, 3));
            if (data.length <= 3) return;
            /** @type {number} */
            this.occupierId = data[3];
        }
        else {
            super(client, data);
            this.externalServerInformation = data[18];
        }
    }

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        this.externalServerInformation = data.GSI;
        return this;
    }
}

module.exports = CastleMapobject;