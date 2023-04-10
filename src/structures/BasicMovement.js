const EmptyMapobject = require("./EmptyMapobject");
const CastleMapobject = require("./CastleMapobject");
const Lord = require("./Lord");
const DungeonMapobject = require("./DungeonMapobject");
const CapitalMapobject = require("./CapitalMapobject");
const InteractiveMapobject = require("./InteractiveMapobject");
const VillageMapobject = require("./VillageMapobject");
const BossDungeonMapobject = require("./BossDungeonMapobject");
const EventDungeonMapobject = require("./EventDungeonMapobject");
const KingstowerMapobject = require("./KingstowerMapobject");
const MonumentMapobject = require("./MonumentMapobject");
const AlienInvasionMapobject = require('./AlienInvasionMapobject');
const DynamicMapobject = require('./DynamicMapobject');
const ResourceIsleMapobject = require("./ResourceIsleMapobject");
const DungeonIsleMapobject = require("./DungeonIsleMapobject");
const NomadInvasionMapobject = require("./NomadInvasionMapobject");
const NomadKhanInvasionMapobject = require("./NomadKhanInvasionMapobject");
const RedAlienInvasionMapobject = require("./RedAlienInvasionMapobject");
const ShapeshifterMapobject = require("./ShapeshifterMapobject");

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
    switch (info[0]) {
        case 0: return new EmptyMapobject(client, info);
        case 1: return new CastleMapobject(client, info);
        case 2: return new DungeonMapobject(client, info);
        case 3: return new CapitalMapobject(client, info);
        case 4: return new CastleMapobject(client, info);
        case 10: return new VillageMapobject(client, info);
        case 11: return new BossDungeonMapobject(client, info);
        case 12: return new CastleMapobject(client, info);
        case 13: return new EventDungeonMapobject(client, info);
        case 21: return new AlienInvasionMapobject(client, info);
        case 22: return new CapitalMapobject(client, info);
        case 23: return new KingstowerMapobject(client, info);
        case 24: return new ResourceIsleMapobject(client, info);
        case 25: return new DungeonIsleMapobject(client, info);
        case 26: return new MonumentMapobject(client, info);
        case 27: return new NomadInvasionMapobject(client, info);
        case 31: return new DynamicMapobject(client, info);
        case 34: return new RedAlienInvasionMapobject(client, info);
        case 35: return new NomadKhanInvasionMapobject(client, info);
        case 36: return new ShapeshifterMapobject(client, info);
        default:
            console.log(`Current mapobject (areatype ${info[0]}) isn't fully supported!`);
            return new InteractiveMapobject(client, info);
    }
}

module.exports = BasicMovement;