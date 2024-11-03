const SeaqueenMapObject = require("./SeaqueenMapObject");
const Localize = require("../../tools/Localize");

class SeaqueenMapShipObject extends SeaqueenMapObject {
    #client;

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
        return Localize.text(this.#client, "bladecoast_surrounding");
    }
}

module.exports = SeaqueenMapShipObject;