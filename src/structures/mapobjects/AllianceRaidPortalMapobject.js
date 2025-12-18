const InteractiveMapobject = require("./InteractiveMapobject");
const Localize = require("../../tools/Localize");

class AllianceRaidPortalMapobject extends InteractiveMapobject {
    travelDistance = 50;
    detailViewBackgroundColor = 16711935;

    #client;

    /**
     * @param {BaseClient} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0,3));
        this.#client = client
    }

    get areaName() {
        return Localize.text(this.#client, "dialogue_are_title");
    }
}

module.exports = AllianceRaidPortalMapobject;