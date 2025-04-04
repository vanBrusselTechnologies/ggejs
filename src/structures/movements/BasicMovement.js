const General = require("../General");
const Lord = require("../Lord");
const {parseMapObject} = require("../../utils/MapObjectParser");
const Coordinate = require("../Coordinate");

class BasicMovement {
    /**
     * @param {Client} client
     * @param {Object} data
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
        this.sourceArea = parseMapObject(client, data.M.SA);
        if (this.sourceArea) this.sourceArea.ownerInfo = client.worldMaps._ownerInfoData.getOwnerInfo(data.M.SID)
        /** @type {Mapobject} */
        this.targetArea = parseMapObject(client, data.M.TA);
        if (this.targetArea) this.targetArea.ownerInfo = client.worldMaps._ownerInfoData.getOwnerInfo(data.M.TID)
        /** @type {Coordinate} */
        let targetPos = this.sourceArea ? this.sourceArea.position : new Coordinate(client, [-1, -1]);
        /** @type {Coordinate} */
        let sourcePos = this.targetArea ? this.targetArea.position : new Coordinate(client, [-1, -1]);
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
                if (data.UM.L.GID !== -1) this.general = new General(client, data.UM.L)
            }
        }
    }
}

module.exports = BasicMovement;