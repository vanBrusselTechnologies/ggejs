const {execute: parseCSL} = require("../e4kserver/onReceived/xt/csl");
const {execute: parseGCA} = require("../e4kserver/onReceived/xt/gca");
const {execute: parseGUI} = require("../e4kserver/onReceived/xt/gui");
const {execute: parseGRC} = require("../e4kserver/onReceived/xt/grc");
const {execute: parseGPA} = require("../e4kserver/onReceived/xt/gpa");
const {execute: parseSIN} = require("../e4kserver/onReceived/xt/sin");
const {execute: parseGAB} = require("../e4kserver/onReceived/xt/gab");
const {execute: parseHIN} = require("../e4kserver/onReceived/xt/hin");

class Castle {
    /** @type {number} */
    kingdomId;
    /** @type {number} */
    areaType;
    /** @type {number} */
    slumLevel;
    /** @type {CastleBuildingInfo} */
    buildingInfo;
    /** @type {CastleUnitInventory} */
    unitInventory;
    /** @type {CastleResourceStorage} */
    resourceStorage;
    /** @type {CastleProductionData} */
    productionData;
    /** @type {CastleBuildingStorage} */
    buildingStorage;
    /** @type {number} */
    builderDiscount;
    /** @type {{foodBoost: number, woodStoneReduction: number}} */
    hunterInfo;
    /** @type {Mapobject} */
    mapobject;

    /**
     *
     * @param {Client} client
     * @param {object} data
     */
    constructor(client, data) {
        if(!data) return;
        this.kingdomId = data["KID"];
        this.areaType = data["T"];
        this.slumLevel = parseCSL(client._socket, 0, data["csl"]);
        this.buildingInfo = parseGCA(client._socket, 0, data["gca"]);
        this.unitInventory = parseGUI(client._socket, 0, data["gui"]);
        this.resourceStorage = parseGRC(client._socket, 0, data["grc"]);
        this.productionData = parseGPA(client._socket, 0, data["gpa"]);
        this.buildingStorage = parseSIN(client._socket, 0, data["sin"]);
        this.builderDiscount = parseGAB(client._socket, 0, data["gab"]);
        this.hunterInfo = parseHIN(client._socket, 0, data["hin"]);
        this.mapobject = this.buildingInfo.mapobject;
        this.owner = this.buildingInfo.owner;

        /* todo
            Missing in Castle:
                - spl: spl0,spl1,spl2,spl3: ShowPackageList (also productionQueue info).
                - uap: UserAttackProtection
                - gsm: GetStatusMines
                - abpi: AreaBuildingProductionInfo
                - crin: CraftingInfo
                - rci: ResourceCartsInfo
                - mot: AllianceBattleGroundMineOutTime
        */
    }
}

module.exports = Castle;