const Client = require('./../Client');

class Coordinate {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        this.X = data[0];
        this.Y = data[1];
    }
}

module.exports = Coordinate;