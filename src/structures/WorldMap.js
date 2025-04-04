class WorldMap {
    /** @type {Mapobject[]} */
    mapObjects = [];

    /**
     * @param {Client} client
     * @param {number} kingdomId
     */
    constructor(client, kingdomId) {
        this.kingdomId = kingdomId;
    };

    /** @param {Mapobject[]} objs */
    _addAreaMapObjects(objs) {
        this.mapObjects.push(...objs);
    }

    _clear() {
        this.mapObjects = [];
    }
}

module.exports = WorldMap;