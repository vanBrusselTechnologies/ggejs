const {parseMapObject} = require("../utils/MapObjectParser");
const Unit = require("./Unit");
const VillageMapobject = require("./mapobjects/VillageMapobject");
const KingstowerMapobject = require("./mapobjects/KingstowerMapobject");
const MonumentMapobject = require("./mapobjects/MonumentMapobject");
const Coordinate = require("./Coordinate");
const InventoryItem = require("./InventoryItem");
const WorldMapOwnerInfo = require("./WorldMapOwnerInfo");

class Player extends WorldMapOwnerInfo {
    /**
     * @param {Client} client
     * @param {Object} data
     */
    constructor(client, data) {
        super(client);
        super.fillFromParamObject(data.O);

        /** @type {(CastleMapobject | CapitalMapobject)[]} */
        this.castles = parseCastleList(client, data.gcl); // TODO move to GCL-parser
        /** @type {{public:{village:VillageMapobject,units?:InventoryItem<Unit>[]}[], private:{privateVillageId: number, uniqueId: number}[]}} */
        this.villages = parseVillageList(client, data.kgv); // TODO move to KGV-parser
        /** @type {{kingstower: KingstowerMapobject, units?: InventoryItem<Unit>[]}[]} */
        this.kingstowers = parseKingstowers(client, data.gkl); // TODO move to GKL-parser
        /** @type {{monument: MonumentMapobject, units?: InventoryItem<Unit>[]}[]} */
        this.monuments = parseMonuments(client, data.gml); // TODO move to GML-parser
        //this.allianceTowers = ; // TODO: horizon
    }
}

/**
 * @param {Client} client
 * @param {number[][]} data
 */
function parseSimpleCastleList(client, data) {
    if (!data) return [];
    return data.map(d => {
        return {areaType: d[4], position: new Coordinate(d.slice(2, 4)), objectId: d[1], kingdomId: d[0]}
    })
}

/**
 * @param {Client} client
 * @param {Object} data
 */
function parseCastleList(client, data) {
    if (!data) return [];
    /** @type {(CastleMapobject | CapitalMapobject)[]} */
    const output = [];
    for (let i in data.C) {
        for (let j in data.C[i].AI) {
            let obj = data.C[i].AI[j];
            let mapObject = parseMapObject(client, obj.AI);
            if (obj.OGT) mapObject["remainingOpenGateTime"] = obj.OGT;
            if (obj.OGC) mapObject["openGateCounter"] = obj.OGC;
            if (obj.AOT) mapObject["remainingAbandonOutpostTime"] = obj.AOT;
            if (obj.TA) mapObject["remainingCooldownAbandonOutpostTime"] = obj.TA;
            if (obj.CAT) mapObject["remainingCancelAbandonTime"] = obj.CAT;
            output.push(mapObject);
        }
    }
    return output;
}

/**
 * @param {Client} client
 * @param {Object} data
 */
function parseVillageList(client, data) {
    /** @type {{public: {village: VillageMapobject, units?: InventoryItem<Unit>[]}[]}[]} */
    const publicVillagesData = [];
    /** @type {{privateVillageId: number, uniqueId: number}[]} */
    const privateVillagesData = [];
    if (!data) return {public: publicVillagesData, private: privateVillagesData};
    for (let i in data.VI) {
        let publicVillage = {};
        publicVillage["village"] = new VillageMapobject(client, data.VI[0][0]);
        if (data.VI[i].length >= 2) {
            publicVillage["units"] = parseUnits(client, data.VI[i][1]);
        }
        publicVillagesData.push(publicVillage)
    }
    for (let i in data.PV) {
        privateVillagesData.push({uniqueId: data.PV[i].VID, privateVillageId: data.PV[i].XID});
    }
    return {public: publicVillagesData, private: privateVillagesData};
}

/**
 * @param {Client} client
 * @param {Array<[number, number]>} data
 * @returns {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    if (!data) return [];
    return data.map(d => {return new InventoryItem(new Unit(client, d[0]), d[1])})
}

/**
 * @param {Client} client
 * @param {Object} data
 */
function parseKingstowers(client, data) {
    /** @type {{kingstower: KingstowerMapobject, units?: InventoryItem<Unit>[]}[]} */
    const kingstowers = [];
    if (!data) return kingstowers;
    for (const i in data.AI) {
        const kingstower = new KingstowerMapobject(client, data.AI[i][0]);
        let units = [];
        if (data.AI[i].length >= 2 && data.AI[i][1] && data.AI[i][1].length > 0) units = parseUnits(client, data.AI[i][1]);
        kingstowers.push({kingstower: kingstower, units: units});
    }
    return kingstowers;
}

/**
 * @param {Client} client
 * @param {Object} data
 */
function parseMonuments(client, data) {
    /** @type {{monument: MonumentMapobject, units?: InventoryItem<Unit>[]}[]} */
    const monuments = [];
    if (!data) return monuments;
    for (const i in data.AI) {
        const monument = new MonumentMapobject(client, data.AI[i][0]);
        let units = [];
        if (data.AI[i].length >= 2 && data.AI[i][1] && data.AI[i][1].length > 0) units = parseUnits(client, data.AI[i][1]);
        monuments.push({monument: monument, units: units});
    }
    return monuments;
}

module.exports = Player;