const BasicMapobject = require("./BasicMapobject");
const Client = require('./../Client');

class BossDungeonMapobject extends BasicMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        if (data[3] !== -1)
        /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        /** @type {number} */
        this.dungeonLevel = data[4];
        if (data[5] > 0)
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        /** @type {number} */
        this.defeaterPlayerId = data[6];
        /** @type {number} */
        this.kingdomId = data[7];
    }
}

module.exports = BossDungeonMapobject;