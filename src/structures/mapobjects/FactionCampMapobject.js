const FactionInteractiveMapobject = require("./FactionInteractiveMapobject");
const Localize = require("../../tools/Localize");

class FactionCampMapobject extends FactionInteractiveMapobject {
    #client;
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.#client = client;
        this.isDestroyed = data[18] === 1;
    }

    get areaName() {
        return Localize.text(this.#client, "faction_camp")
    }
}

module.exports = FactionCampMapobject;