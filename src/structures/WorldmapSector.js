const Worldmap = require('./Worldmap')

class WorldmapSector extends Worldmap {
    constructor(client, kingdomId, data) {
        super(client, kingdomId);
        this.players = data.players;
        this.mapobjects = data.worldmapAreas;
    }

    /**
     *
     * @param {WorldmapSector} sectors
     * @returns {WorldmapSector}
     */
    combine(...sectors){
        for(const sector of sectors) {
            this.players.concat(sector.players);
            this.mapobjects.concat(sector.mapobjects);
        }
        return this;
    }
}

module.exports = WorldmapSector;