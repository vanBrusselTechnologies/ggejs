const Client = require("../Client");
const units = require("./../data/ingame_data/units.json");

class Unit {
    /**
     * 
     * @param {Client} client 
     * @param {number} wodId 
     */
    constructor(client, wodId) {
        /** @type {number} */
        this.wodId = wodId;
        /** @type {object} */
        this.rawData = getData(wodId);
        /** @type {boolean} */
        this.isSoldier = isSoldier(this.rawData);
    }
}

/**
 * 
 * @param {object} rawData 
 * @returns {boolean}
 */
function isSoldier(rawData) {
    if (rawData.rangeDefence !== undefined)
        return true;
    else
        return false;
}

/**
 * 
 * @param {number} wodId 
 * @returns {object}
 */
function getData(wodId) {
    for (let i in units) {
        if (wodId === parseInt(units[i].wodID)) {
            return units[i];
        }
    }
}

module.exports = Unit;