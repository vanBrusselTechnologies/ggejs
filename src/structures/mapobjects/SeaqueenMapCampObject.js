const SeaqueenMapObject = require("./SeaqueenMapObject");
const Localize = require("../../tools/Localize");

class SeaqueenMapCampObject extends SeaqueenMapObject {
    #client;

    areaType = 8

    /**
     *
     * @param {Client} client
     * @param {number} type
     * @param {number} x
     * @param {number} y
     */
    constructor(client, type, x = -1, y = -1) {
        super(client, type, x, y);
        this.#client = client;
        this.objectId = -24;
        this.useHomeCastleForUnlockedInfo = true;
    }

    get areaName() {
        return Localize.text(this.#client, "monthevents_expeditioncamp");
    }
}

module.exports = SeaqueenMapCampObject;