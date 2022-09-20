const Coordinate = require('./Coordinate');
const Client = require('./../Client');

class BasicMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        /** @type {number} */
        this.areaType = data[0];
        /** @type {Coordinate} */
        this.position = new Coordinate(client, data.slice(1, 3));
    }
}

module.exports = BasicMapobject;