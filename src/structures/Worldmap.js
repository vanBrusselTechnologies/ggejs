class Worldmap {
    /** @type {Mapobject[]} */
    mapobjects = [];
    /** @type {Player[]} */
    players = [];
    /** @type {number[]} */
    #playerIds = [];
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
    /**
     * 
     * @param {Player[]} objs
     */
    _addPlayers(objs) {
        if (!objs || objs.length === 0) return;
        for (let i = 0; i < objs.length; i++) {
            let obj = objs[i];
            if (this.#playerIds.includes(obj.playerId)) {
                objs.splice(i, 1);
                i--
            }
            else
                this.#playerIds.push(obj.playerId);
        }
        this.players = this.players.concat(objs);
    }
    /**
     * 
     * @returns {Player[]}
     */
    _sortPlayersByName() {
        return this.players.sort((x, y) => {
            if (x.playerName.toLowerCase() > y.playerName.toLowerCase()) return 1;
            if (y.playerName.toLowerCase() > x.playerName.toLowerCase()) return -1;
            return 0;
        });
    }
    /**
     * 
     * @returns {Player[]}
     */
    _sortPlayersById() {
        return this.players.sort((x, y) => x.playerId - y.playerId);
    }
    _clear() {
        this.mapobjects = [];
        this.players = [];
        this.#playerIds = [];
    }
}

module.exports = Worldmap;