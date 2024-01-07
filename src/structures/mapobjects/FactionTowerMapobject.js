const FactionInteractiveMapobject = require("./FactionInteractiveMapobject");
const Localize = require("../../tools/Localize");
const Coordinate = require("../Coordinate");

class FactionTowerMapobject extends FactionInteractiveMapobject {
    #client;
    travelDistance = 5;

    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        if (data.length <= 3) return;
        this.#client = client;
        this.ownerId = data[3];
        this.isDestroyed = data[4] === 1;
        this.aliveProtectorPositions = data[5].map(p => new Coordinate(client, p));
        if (data[6] > 0 && !this.isDestroyed) {
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[6] * 1000);
        }
        this.dungeonLevel = data[7];
        this.attacksLeft = this.isDestroyed ? 0 : data[8];
        this.objectId = data[9];
        /** @type {number} */
        this.wallWodId = this.dungeonLevel < 11 ? 501 : this.dungeonLevel < 24 ? 502 : 503;
        /** @type {number} */
        this.gateWodId = this.dungeonLevel < 11 ? 450 : this.dungeonLevel < 24 ? 451 : 452;
    }

    get areaName() {
        return Localize.text(this.#client, "faction_tower")
    }

    get titleText(){
        return this.areaName;
    }

    get levelText() {
        const attacksLeftString = `factiontower_attacksLeft${this.attacksLeft > 1 ? "_plural" : "_singular"}`;
        return Localize.text(this.#client, attacksLeftString, [this.attacksLeft])
    }

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        this.ownerId = data["DP"];
        return this;
    }
}

module.exports = FactionTowerMapobject;