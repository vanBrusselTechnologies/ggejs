const WorldMap = require('./WorldMap')

class WorldMapSector extends WorldMap {
    constructor(client, kingdomId, data) {
        super(client, kingdomId);
        this.mapObjects = data.worldMapAreas;
    }

    /** @param {WorldMapSector} sectors */
    combine(...sectors) {
        for (const sector of sectors) this.mapObjects.concat(sector.mapObjects);
        return this;
    }
}

module.exports = WorldMapSector;