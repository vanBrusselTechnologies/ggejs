const {parseMapObject} = require("../utils/MapObjectParser");
const Unit = require("./Unit");
const VillageMapobject = require("./mapobjects/VillageMapobject");
const KingstowerMapobject = require("./mapobjects/KingstowerMapobject");
const MonumentMapobject = require("./mapobjects/MonumentMapobject");
const Coordinate = require("./Coordinate");
const InventoryItem = require("./InventoryItem");
const WorldmapOwnerInfo = require("./WorldmapOwnerInfo");

class Player extends WorldmapOwnerInfo {
    /**
     *
     * @param {Client} client
     * @param {Object} data
     */
    constructor(client, data) {
        super(client);
        super.fillFromParamObject(data.O);

        /** @type {(CastleMapobject | CapitalMapobject)[]} */
        this.castles = parseCastleList(client, data.gcl);
        /** @type {{public:{village:VillageMapobject,units?:InventoryItem<Unit>[]}[], private:{privateVillageId: number, uniqueId: number}[]}} */
        this.villages = parseVillageList(client, data.kgv);
        /** @type {{kingstower: KingstowerMapobject, units?: InventoryItem<Unit>[]}[]} */
        this.kingstowers = parseKingstowers(client, data.gkl);
        /** @type {{monument: MonumentMapobject, units?: InventoryItem<Unit>[]}[]} */
        this.monuments = parseMonuments(client, data.gml);
        //this.allianceTowers = ; //horizon
    }
}

/**
 *
 * @param {Client} client
 * @param {Array} data
 * @returns {{areaType: number, position: Coordinate, objectId: number, kingdomId: number}[]}
 */
function parseSimpleCastleList(client, data) {
    if (!data) return [];
    return data.map(d => {
        return {areaType: d[4], position: new Coordinate(client, d.slice(2, 4)), objectId: d[1], kingdomId: d[0]}
    })
}

/**
 *
 * @param {Client} client
 * @param {Object} data
 * @returns {(CastleMapobject | CapitalMapobject)[]}
 */
function parseCastleList(client, data) {
    if (!data) return [];
    let output = [];
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
 *
 * @param {Client} client
 * @param {Object} data
 * @returns {{ public: { village: VillageMapobject, units?: InventoryItem<Unit>[] }[], private: { privateVillageId: number, uniqueId: number }[]}}
 */
function parseVillageList(client, data) {
    let publicVillagesData = [];
    let privateVillagesData = [];
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
 *
 * @param {Client} client
 * @param {Array<[number, number]>} data
 * @returns {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    if (!data) return [];
    return data.map(d => {
        return new InventoryItem(new Unit(client, d[0]), d[1])
    })
}

/**
 *
 * @param {Client} client
 * @param {Object} data
 * @returns {{ kingstower: KingstowerMapobject, units?: InventoryItem<Unit>[] }[]}
 */
function parseKingstowers(client, data) {
    let kingstowers = [];
    if (!data) return kingstowers;
    for (let i in data.AI) {
        let kingstower = new KingstowerMapobject(client, data.AI[i][0]);
        let units = [];
        if (data.AI[i].length >= 2 && data.AI[i][1] && data.AI[i][1].length > 0) units = parseUnits(client, data.AI[i][1]);
        kingstowers.push({kingstower: kingstower, units: units});
    }
    return kingstowers;
}

/**
 *
 * @param {Client} client
 * @param {Object} data
 * @returns {{ monument: MonumentMapobject, units?: InventoryItem<Unit>[] }[]}
 */
function parseMonuments(client, data) {
    let monuments = [];
    if (!data) return monuments;
    for (let i in data.AI) {
        let monument = new MonumentMapobject(client, data.AI[i][0]);
        let units = [];
        if (data.AI[i].length >= 2 && data.AI[i][1] && data.AI[i][1].length > 0) units = parseUnits(client, data.AI[i][1]);
        monuments.push({monument: monument, units: units});
    }
    return monuments;
}

module.exports = Player;