const FactionInteractiveMapobject = require("./FactionInteractiveMapobject");
const Localize = require("../../tools/Localize");
const Coordinate = require("../Coordinate");

class FactionCapitalMapobject extends FactionInteractiveMapobject {
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
        this.aliveProtectorPositions = data[4].map(p => new Coordinate(client, p));
        if (data[5] > 0) {
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[5] * 1000);
        }
        this.dungeonLevel = data[6];
        this.isDestroyed = data[7] === 1;
        this.objectId = data[8];
    }

    get areaName() {
        return Localize.text(this.#client, "faction_capital")
    }

    get titleText(){
        return this.areaName;
    }
}

module.exports = FactionCapitalMapobject;