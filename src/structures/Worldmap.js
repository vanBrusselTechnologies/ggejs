class Worldmap {
    mapobjects = [];
    constructor(client, kingdomId) {
        this.kingdomId = kingdomId;
    };
    _addAreaMapObjects(objs) {
        this.mapobjects = this.mapobjects.concat(objs);
    }
    _clear() {
        this.mapobjects = [];
    }
}

module.exports = Worldmap;