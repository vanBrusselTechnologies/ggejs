const TreasureMapMapobject = require("./TreasureMapMapobject");
const Localize = require("../../tools/Localize");

class SeaqueenMapObject extends TreasureMapMapobject {
    #client;

    kingdomId = -1;
    areaType = 7;

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
    }

    get areaName() {
        return Localize.text(this.#client, "bladecoast_tower");
    }
}

module.exports = SeaqueenMapObject;