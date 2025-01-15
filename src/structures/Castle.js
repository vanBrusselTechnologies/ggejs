const {execute: csl} = require("../e4kserver/onReceived/xt/csl");
const {execute: gca} = require("../e4kserver/onReceived/xt/gca");
const {execute: gui} = require("../e4kserver/onReceived/xt/gui");
const {execute: grc} = require("../e4kserver/onReceived/xt/grc");
const {execute: gpa} = require("../e4kserver/onReceived/xt/gpa");
const {execute: sin} = require("../e4kserver/onReceived/xt/sin");
const {execute: gab} = require("../e4kserver/onReceived/xt/gab");
const {execute: hin} = require("../e4kserver/onReceived/xt/hin");

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
     * @param {Object} data
     */
    constructor(client, data) {
        if (!data) return;
        this.kingdomId = data["KID"];
        this.areaType = data["T"];
        this.slumLevel = csl(client._socket, 0, data["csl"]);
        this.buildingInfo = gca(client._socket, 0, data["gca"]);
        this.unitInventory = gui(client._socket, 0, data["gui"]);
        this.resourceStorage = grc(client._socket, 0, data["grc"]);
        this.productionData = gpa(client._socket, 0, data["gpa"]);
        this.buildingStorage = sin(client._socket, 0, data["sin"]);
        this.builderDiscount = gab(client._socket, 0, data["gab"]);
        this.hunterInfo = hin(client._socket, 0, data["hin"]);
        this.mapobject = this.buildingInfo.mapobject;

        /* todo
            Missing in Castle: (see "jaa")
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