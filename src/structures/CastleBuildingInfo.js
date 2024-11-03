const BasicBuilding = require("./BasicBuilding");
const {parseMapObject} = require("../utils/MapObjectParser");
const {execute: scl} = require("../e4kserver/onReceived/xt/scl");
const BuildingGround = require("./BuildingGround");
const CastleConstructionItemBuilding = require("./CastleConstructionItemBuilding");

class CastleBuildingInfo {
    /** @type {BasicBuilding[]} */
    buildings = [];
    /** @type {BasicBuilding[]} */
    towers = [];
    /** @type {BasicBuilding[]} */
    gates = [];
    /** @type {BasicBuilding} */
    castleWall = null;
    /** @type {BasicBuilding} */
    moat = null;
    /** @type {BasicBuilding[]} */
    fixedPositionBuildings = []
    /** @type {Mapobject} */
    mapobject = null;
    /** @type {BuildingGround[]} */
    buildingGround = [];
    /** @type {number} */
    startPointX = 0;
    /** @type {number} */
    startPointY = 0;
    /** @type {ConstructionSlot[]} */
    constructionList = []
    /** @type {{food: number, stone:number, wood:number}}*/
    resourceFields = {
        food: 0, stone: 0, wood: 0
    }
    /** @type {{building: number, constructionItems: CastleConstructionItemBuilding[]}[]} */
    constructionItemsPerBuilding = [];

    /**
     *
     * @param {Client} client
     * @param {{}} data
     */
    constructor(client, data) {
        if (!data) return;
        this.buildings = parseBuildings(client, data["BD"]);
        this.towers = parseBuildings(client, data["T"]);
        this.gates = parseBuildings(client, data["G"]);
        const defence = parseBuildings(client, data["D"]);
        for (const d of defence) {
            if (d.rawData.name === 'Basic' && d.rawData.group === 'Moat') this.moat = d;
            if (d.rawData.name === 'Castlewall' && d.rawData.group === 'Defence') this.castleWall = d;
        }
        this.mapobject = parseMapObject(client, data["A"]);
        this.buildingGround = parseBuildingGround(client, data["BG"]);
        const baseBuildingGround = this.buildingGround.find(bg => bg.wodId === 200)
        this.startPointX = baseBuildingGround.position.X;
        this.startPointY = baseBuildingGround.position.Y;
        if (data["scl"]) this.constructionList = scl(client._socket, 0, data["scl"]);
        if (data["FP"]) this.fixedPositionBuildings = parseBuildings(client, data["FP"]);
        this.resourceFields = {
            food: data["RAF"], stone: data["RAS"], wood: data["RAW"]
        }
        this.constructionItemsPerBuilding = parseConstructionItemBuildings(client, data["CI"], this.buildings)
    }
}

/**
 *
 * @param {Client} client
 * @param {[]} data
 * @returns {BasicBuilding[]}
 */
function parseBuildings(client, data) {
    let buildings = [];
    for (let buildingData of data) {
        buildings.push(new BasicBuilding(client, buildingData));
    }
    return buildings;
}

/**
 *
 * @param {Client} client
 * @param {[]} data
 * @returns {BuildingGround[]}
 */
function parseBuildingGround(client, data) {
    const buildingGround = [];
    for (let bg of data) {
        buildingGround.push(new BuildingGround(client, bg))
    }
    return buildingGround
}

/**
 *
 * @param {Client} client
 * @param {[{OID:number, CIL:[]}]} data
 * @param {BasicBuilding[]} buildings
 * @returns {{building: number, constructionItems: CastleConstructionItemBuilding[]}[]}
 */
function parseConstructionItemBuildings(client, data, buildings) {
    let buildingList /* Dictionary */ = [];
    for (let o of data) {
        const cil = [];
        for (let ci of o.CIL) {
            cil.push(new CastleConstructionItemBuilding(client, ci));
        }
        const building = buildings.find(x => x.objectId === o.OID)
        buildingList.push({building: building, constructionItems: cil});
    }
    return buildingList
}

module.exports = CastleBuildingInfo;