const SamuraiInvasionMapobject = require("./SamuraiInvasionMapobject");

class DaimyoMapobject extends SamuraiInvasionMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.daimyoId = this.victoryCount;
        this.victoryCount = 0;
        this.totalCooldown = data[6];
        this.skipCost = data[7];
    }
}

module.exports = DaimyoMapobject;