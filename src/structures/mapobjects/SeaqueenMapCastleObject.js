const SeaqueenMapObject = require("./SeaqueenMapObject");
const Localize = require("../../tools/Localize");

class SeaqueenMapCastleObject extends SeaqueenMapObject {
    #client;

    /**
     * @param {BaseClient} client
     * @param {number} type
     * @param {number} x
     * @param {number} y
     */
    constructor(client, type, x = -1, y = -1) {
        super(client, type, x, y);
        this.#client = client;
    }

    get areaName() {
        return Localize.text(this.#client, "bladecoast_tower");
    }
}

module.exports = SeaqueenMapCastleObject;