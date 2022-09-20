const Client = require('./../Client');

class AllianceDonations {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        /** @type {number} */
        this.coins = data[1];
        /** @type {number} */
        this.rubies = data[2];
        /** @type {number} */
        this.res = data[3];
    };
}

module.exports = AllianceDonations;