const Coordinate = require('../Coordinate');

class BasicMapobject {
    #client;

    /**
     * @param {BaseClient} client
     * @param {Array} data
     */
    constructor(client, data) {
        if (data.length === 0) return;
        this.#client = client;
        /** @type {number} */
        this.areaType = data[0];
        /** @type {Coordinate} */
        this.position = new Coordinate(data.slice(1, 3));
    }

    /** @param {{}} data */
    parseAreaInfoBattleLog(data) {
        this.areaType = data.AT;
        this.position = new Coordinate([data.X, data.Y]);
        this.kingdomId = data.K;
        this.mapId = data.MID;
        return this;
    }
}

module.exports = BasicMapobject;