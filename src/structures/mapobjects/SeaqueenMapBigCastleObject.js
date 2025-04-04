const SeaqueenMapCastleObject = require("./SeaqueenMapCastleObject");
const Localize = require("../../tools/Localize");

class SeaqueenMapBigCastleObject extends SeaqueenMapCastleObject {
    #client;

    /**
     * @param {Client} client
     * @param {number} type
     * @param {number} x
     * @param {number} y
     */
    constructor(client, type, x = -1, y = -1) {
        super(client, type, x, y);
        this.#client = client;
    }

    get areaName() {
        return Localize.text(this.#client, "seasonEvent_22_middle_dungeon");
    }
}

module.exports = SeaqueenMapBigCastleObject;