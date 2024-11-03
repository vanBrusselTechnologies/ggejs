const SeaqueenMapObject = require("./SeaqueenMapObject");
const Localize = require("../../tools/Localize");

class SeaqueenMapKrakenObject extends SeaqueenMapObject {
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
        /*if(isUnlocked) */return Localize.text(this.#client, "bladecoast_finalboss");
        return Localize.text(this.#client, "bladecoast_fog");
    }
}

module.exports = SeaqueenMapKrakenObject;