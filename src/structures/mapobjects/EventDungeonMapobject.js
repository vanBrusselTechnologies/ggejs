const InteractiveMapobject = require("./InteractiveMapobject");
const Localize = require("../../tools/Localize");

class EventDungeonMapobject extends InteractiveMapobject {
    /** @type {BaseClient} */
    #client;
    eventId = 26;
    /** @type {number} */
    skinId;

    /**
     * @param {BaseClient} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        this.#client = client;
        if (data[3] !== -1)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        /** @type {number} */
        this.dungeonLevel = data[4];
        /** @type {boolean} */
        this.isDefeated = data[5] === 1;
    }

    get areaName() {
        /*TODO: if (geActiveSkinProperties()) return geActiveSkinProperties().areaTextID; */
        return Localize.text(this.#client, "fortress_robberbaron");
    }
}

module.exports = EventDungeonMapobject;