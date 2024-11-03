const Coordinate = require("./Coordinate");
const {buildings} = require('e4k-data').data;

class BasicBuilding {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        /** @type {number} */
        this.wodId = data[0];
        this.rawData = buildings.find(b => b.wodID === this.wodId);
        /** @type {number} */
        this.objectId = data[1];
        /** @type {Coordinate} */
        this.position = new Coordinate(client, data.slice(2, 4));
        /** @type {number} */
        this.isoRotation = data[4];
        if (data[5] > 0) /** @type {Date} */this.objectConstructionStartDate = new Date(Date.now() - data[5] * 1000);
        /** @type {number} */
        this.buildingState = data[6];
        /** @type {number} */
        this.hitpoints = data[7];
        /** @type {number} */
        this.productionBoostAtStart = data[8] / 100;
        /** @type {number} */
        this.efficiency = data[9];
        ///** @type {number} */
        //this.damageType = data[10];
        ///** @type {number} */
        //this.decoPoints = data[11];
        ///** @type {number} */
        this.fusionXP = data[12];
        /** @type {number} */
        this.productionSpeed = data[13];
        /** @type {boolean} */
        this.isInDistrict = data[14] === 1;
        /** @type {number} */
        this.districtSlotId = data[15];
    }
}

module.exports = BasicBuilding;