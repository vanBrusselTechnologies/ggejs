const FactionInteractiveMapobject = require("./FactionInteractiveMapobject");
const Localize = require("../../tools/Localize");
const Coordinate = require("../Coordinate");

class FactionVillageMapobject extends FactionInteractiveMapobject {
    #client;
    travelDistance = 5;

    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        this.#client = client;
        this.ownerId = data[3];
        this.ownerInfo = client.worldmaps._ownerInfoData.getOwnerInfo(this.ownerId);
        this.aliveProtectorPositions = Array.isArray(data[4]) ? data[4].map(p => new Coordinate(client, p)) : [];
        if (data[5] > 0) {
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[5] * 1000);
        }
        this.dungeonLevel = data[6];
        if (data[7] > 0) {
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[7] * 1000);
        }
    }

    get areaName() {
        return Localize.text(this.#client, "faction_village")
    }
}

module.exports = FactionVillageMapobject;