const InteractiveMapobject = require("./InteractiveMapobject");

class ShadowAreaMapobject extends InteractiveMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        if (data[3] > 0)
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[3] * 1000);
        if (data[4] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[4] * 1000);
    }

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        return this;
    }
}

module.exports = ShadowAreaMapobject;