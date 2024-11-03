class Worldmap {
    /** @type {Mapobject[]} */
    mapobjects = [];
    /**
     * 
     * @param {Client} client 
     * @param {number} kingdomId 
     */
    constructor(client, kingdomId) {
        /** @type {number} */
        this.kingdomId = kingdomId;
    };
    /**
     * 
     * @param {Mapobject[]} objs
     */
    _addAreaMapObjects(objs) {
        this.mapobjects.push(...objs);
    }
    _clear() {
        this.mapobjects = [];
    }
}

module.exports = Worldmap;