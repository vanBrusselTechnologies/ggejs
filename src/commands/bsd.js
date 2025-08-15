const General = require("../structures/General");
const Good = require("../structures/Good");
const InventoryItem = require("../structures/InventoryItem");
const Lord = require("../structures/Lord");
const {parseMapObject} = require("../utils/MapObjectParser");

const NAME = "bsd";
/** @type {CommandCallback<SpyLog>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const spyLog = parseBSD(client, params);
    require('.').baseExecuteCommand(client, spyLog, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} messageId
 * @return {Promise<SpyLog>}
 */
module.exports.getSpyLog = function (client, messageId) {
    const C2SSpyLogVO = {MID: messageId};
    return require('.').baseSendCommand(client, NAME, C2SSpyLogVO, callbacks, (p) => p?.["MID"] === messageId);
}

module.exports.bsd = parseBSD;

/**
 * @param {BaseClient} client
 * @param {Object} params
 * @return {SpyLog}
 */
function parseBSD(client, params) {
    if (params == null || params?.AI == null) return null;
    const originOwner = client.worldMaps._ownerInfoData.parseOwnerInfo(params["SO"]);
    const targetOwner = client.worldMaps._ownerInfoData.parseOwnerInfo(params["OI"]);
    const mapObject = parseWorldMapArea(client, params["AI"]);
    if (params["DAR"]) mapObject.rank = params["DAR"];
    if (params["RS"]) {
        mapObject.attackCooldownEnd = new Date(Date.now() + params["RS"] * 1000);
        mapObject.isVisibleOnMap = true;
    }
    const spyResources = [];
    if (params["R"]) {
        for (let r of params["R"]) {
            spyResources.push(new Good(r));
        }
    }
    const armyInfo = params["S"] == null ? null : parseSpyArmyInfo(client, params);
    return {
        messageId: params.MID,
        castleId: params["CID"],
        castleAppearance: params["CI"],
        spyCount: params["SC"],
        guardCount: params["GC"],
        spyAccuracy: params["SA"],
        spyRisk: params["SR"],
        targetMapObject: mapObject,
        originOwner: originOwner,
        targetOwner: targetOwner,
        spyResources: spyResources,
        armyInfo: armyInfo,
    };
}

/**
 * @param {BaseClient} client
 * @param {Object} data
 */
function parseWorldMapArea(client, data) {
    return parseMapObject(client, [data["AT"]]).parseAreaInfoBattleLog(data);
}

/**
 * @param {BaseClient} client
 * @param {Object} data
 * @returns {{army: { left: InventoryItem<Unit>[], middle: InventoryItem<Unit>[], right: InventoryItem<Unit>[], keep: InventoryItem<Unit>[], unitsKeepInventory: InventoryItem<Unit>[], stronghold: InventoryItem<Unit>[]}, spyTime: Date, defenderBaron: Lord, defenderGeneral?: General, defenderLegendSkills: []}}
 */
function parseSpyArmyInfo(client, data) {
    let spyLogArmyParamArray = data["S"];
    if (spyLogArmyParamArray == null) return {};
    const unitsLeft = parseSingleFlank(0, spyLogArmyParamArray);
    const unitsMiddle = parseSingleFlank(1, spyLogArmyParamArray);
    const unitsRight = parseSingleFlank(2, spyLogArmyParamArray);
    const unitsKeep = parseSingleFlank(3, spyLogArmyParamArray);
    const unitsKeepInventory = parseSingleFlank(5, spyLogArmyParamArray);
    const unitsStronghold = parseSingleFlank(5, spyLogArmyParamArray);
    const spyTime = new Date(Date.now() - data["AS"]);
    /**@type {Lord}*/
    let defenderBaron = null;
    let defenderLegendSkills = [];
    /**@type {General}*/
    let defenderGeneral = null;
    if (data["B"]) {
        defenderBaron = new Lord(client, data["B"]);
        defenderLegendSkills = data["LS"] ?? [];
        if (defenderBaron.generalId !== -1) {
            defenderGeneral = new General(client, data["B"]);
        }
    }
    return {
        army: {
            left: unitsLeft,
            middle: unitsMiddle,
            right: unitsRight,
            keep: unitsKeep,
            unitsKeepInventory: unitsKeepInventory,
            stronghold: unitsStronghold
        },
        spyTime: spyTime,
        defenderBaron: defenderBaron,
        defenderGeneral: defenderGeneral,
        defenderLegendSkills: defenderLegendSkills,
    };
}

/**
 * @param {number} flankId
 * @param {Array} paramArray
 * @return {InventoryItem[]}
 */
function parseSingleFlank(flankId, paramArray) {
    const flankUnits = [];
    for (const unit_count of paramArray[flankId]) {
        flankUnits.push(new InventoryItem(unit_count[0], unit_count[1]));
    }
    return flankUnits;
}