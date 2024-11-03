const InteractiveMapobject = require("./InteractiveMapobject");

class EventDungeonMapobject extends InteractiveMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0,3));
        if (data[3] !== -1)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        /** @type {number} */
        this.dungeonLevel = data[4];
        /** @type {boolean} */
        this.isDefeated = data[5] === 1;
    }
}

module.exports = EventDungeonMapobject;