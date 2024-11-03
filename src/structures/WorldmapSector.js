const Worldmap = require('./Worldmap')

class WorldmapSector extends Worldmap {
    constructor(client, kingdomId, data) {
        super(client, kingdomId);
        this.mapobjects = data.worldmapAreas;
    }

    /**
     *
     * @param {WorldmapSector} sectors
     * @returns {WorldmapSector}
     */
    combine(...sectors){
        for(const sector of sectors) {
            this.mapobjects.concat(sector.mapobjects);
        }
        return this;
    }
}

module.exports = WorldmapSector;