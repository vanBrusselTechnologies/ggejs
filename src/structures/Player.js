const {parseMapObject} = require("../utils/MapObjectParser");
const Unit = require("./Unit");
const VillageMapobject = require("./mapobjects/VillageMapobject");
const KingstowerMapobject = require("./mapobjects/KingstowerMapobject");
const MonumentMapobject = require("./mapobjects/MonumentMapobject");
const Coordinate = require("./Coordinate");
const Crest = require("./Crest");

class Player {
    /**
     *
     * @param {Client} client
     * @param {object} data
     */
    constructor(client, data) {
        /** @type {number} */
        this.playerId = data.O.OID;
        /** @type {boolean} */
        this.isDummy = data.O.DUM === 1;
        /** @type {string} */
        this.playerName = data.O.N;
        this.crest = new Crest(client, data.O.E);
        /** @type {number} */
        this.playerLevel = data.O.L;
        /** @type {number} */
        this.paragonLevel = data.O.LL;
        if (data.O.RNP > 0) this.noobEndTime = new Date(Date.now() + data.O.RNP * 1000);
        /** @type {number} */
        this.honor = data.O.H;
        /** @type {number} */
        this.famePoints = data.O.CF;
        /** @type {number} */
        this.highestFamePoints = data.O.HF;
        /** @type {boolean} */
        this.isRuin = data.O.R === 1;
        /** @type {number} */
        this.allianceId = data.O.AID;
        /** @type {string} */
        this.allianceName = data.O.AN;
        /** @type {number} */
        this.allianceRank = data.O.AR;
        /** @type {boolean} */
        this.isSearchingAlliance = data.O.SA === 1;
        if (data.O.RPT > 0) this.peaceEndTime = new Date(Date.now() + data.O.RPT * 1000);
        if (!data.gcl) {
            this.castles = parseSimpleCastleList(client, data.O.AP);
            this.villages = {private: [], public: []};
            this.kingstowers = [];
            this.monuments = [];
        } else {
            /** @type {(CastleMapobject | CapitalMapobject)[]} */
            this.castles = parseCastleList(client, data.gcl);
            /** @type {{public:{village:VillageMapobject,units?:InventoryItem<Unit>[]}[], private:{privateVillageId: number, uniqueId: number}[]}} */
            this.villages = parseVillageList(client, data.kgv);
            /** @type {KingstowerMapobject[]} */
            this.kingstowers = parseKingstowers(client, data.gkl);
            /** @type {MonumentMapobject[]} */
            this.monuments = parseMonuments(client, data.gml);
        }
        //this.allianceTowers = ; //horizon
        /** @type {boolean} */
        this.hasPremiumFlag = data.O.PF === 1;
        /** @type {number} */
        this.might = data.O.MP;
        /** @type {number} */
        this.achievementPoints = data.O.AVP;
        /** @type {number} */
        this.prefixTitleId = data.O.PRE;
        /** @type {number} */
        this.suffixTitleId = data.O.SUF;
        if (data.O.RRD > 0) this.relocateDurationEndTime = new Date(Date.now() + data.O.RRD * 1000);
        if (data.O.FN && data.O.FN.FID !== -1) {
            /** @type {number} */
            this.factionId = data.O.FN.FID;
            /** @type {number} */
            this.factionMainCampId = data.O.FN.MC;
            /** @type {boolean} */
            this.factionIsSpectator = data.O.FN.SPC === 1;
            /** @type {number} */
            this.factionProtectionStatus = data.O.FN.PMS;
            if (data.O.FN.PMT > 0) /** @type {Date} */
            this.factionProtectionEndTime = new Date(Date.now() + data.O.FN.PMT * 1000);
            if (data.O.FN.NS > 0) /** @type {Date} */
            this.factionNoobProtectionEndTime = new Date(Date.now() + data.O.FN.NS * 1000);
        }
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
 * @param {object} data
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
 * @param {object} data
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
 * @param {Array} data
 * @returns {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    if (!data) return [];
    return data.map(d => {
        return {item: new Unit(client, d[0]), count: d[1]}
    })
}

/**
 *
 * @param {Client} client
 * @param {object} data
 * @returns {KingstowerMapobject[]}
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
 * @param {object} data
 * @returns {MonumentMapobject[]}
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