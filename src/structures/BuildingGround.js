const Coordinate = require("./Coordinate");

class BuildingGround {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        /** @type {number} */
        this.wodId = data[0];
        /** @type {number} */
        this.objectId = data[1];
        /** @type {Coordinate} */
        this.position = new Coordinate(client, data.slice(2, 4));
        /** @type {number} */
        this.isoRotation = data[4];
    }
}

module.exports = BuildingGround;