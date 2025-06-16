const {execute: csl} = require("../commands/onReceived/csl");
const {execute: gca} = require("../commands/onReceived/gca");
const {execute: gui} = require("../commands/onReceived/gui");
const {execute: grc} = require("../commands/onReceived/grc");
const {execute: gpa} = require("../commands/onReceived/gpa");
const {execute: sin} = require("../commands/onReceived/sin");
const {execute: gab} = require("../commands/onReceived/gab");
const {execute: hin} = require("../commands/onReceived/hin");

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
     * @param {Client} client
     * @param {Object} data
     */
    constructor(client, data) {
        if (!data) return;
        this.kingdomId = data["KID"];
        this.areaType = data["T"];
        this.slumLevel = csl(client, 0, data["csl"]);
        this.buildingInfo = gca(client, 0, data["gca"]);
        this.unitInventory = gui(client, 0, data["gui"]);
        this.resourceStorage = grc(client, 0, data["grc"]);
        this.productionData = gpa(client, 0, data["gpa"]);
        this.buildingStorage = sin(client, 0, data["sin"]);
        this.builderDiscount = gab(client, 0, data["gab"]);
        this.hunterInfo = hin(client, 0, data["hin"]);
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