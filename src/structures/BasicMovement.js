const Lord = require("./Lord");
const {parseMapObject} = require("../utils/MapObjectParser");

class BasicMovement {
    /**
     * 
     * @param {Client} client 
     * @param {object} data 
     */
    constructor(client, data) {
        const now = Date.now();
        /** @type {number} */
        this.movementType = data.M.T;
        /** @type {number} */
        this.movementId = data.M.MID;
        /** @type {Date} */
        this.departureTime = new Date(now - data.M.PT * 1000);
        /** @type {Date} */
        this.arrivalTime = new Date(now + (data.M.TT - data.M.PT) * 1000);
        /** @type {number} */
        this.direction = data.M.D;
        /** @type {Mapobject} */
        this.sourceArea = getAreaFromInfo(client, data.M.SA);
        /** @type {Mapobject} */
        this.targetArea = getAreaFromInfo(client, data.M.TA);
        /** @type {Coordinate} */
        let targetPos = this.sourceArea.position;
        /** @type {Coordinate} */
        let sourcePos = this.targetArea.position;
        /** @type {number} */
        this.distance = Math.round(Math.sqrt(Math.pow(Math.abs(sourcePos.X - targetPos.X), 2) + Math.pow(Math.abs(sourcePos.Y - targetPos.Y), 2)) * 10) / 10;
        /** @type {Mapobject} */
        this.ownerArea = this.direction === 0 ? this.sourceArea : this.targetArea;
        /** @type {number} */
        this.kingdomId = data.M.KID;
        /** @type {number} */
        this.horseBoosterWodId = data.M.HBW;
        if (data.UM) {
            /** @type {Date} */
            this.endWaitTime = new Date(now + (data.M.TT - data.M.PT + data.UM.TWD - data.UM.PWD) * 1000);
            if (data.UM.L) {
                /** @type {Lord} */
                this.lord = new Lord(client, data.UM.L);
            }
        }
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Array} info 
 * @returns {Mapobject}
 */
function getAreaFromInfo(client, info) {
    return parseMapObject(client, info)
}

module.exports = BasicMovement;