const Good = require("../../../structures/Good");
const Localize = require("../../../tools/Localize");
const InventoryItem = require("../../../structures/InventoryItem");
const Lord = require("../../../structures/Lord");
const General = require("../../../structures/General");
const {parseMapObject} = require("../../../utils/MapObjectParser");

module.exports.name = "bsd";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (params == null || errorCode === 66 || errorCode === 130) {
        socket[`bsd -> errorCode`] = errorCode;
        return;
    }
    const client = socket.client;
    const mapObject = parseWorldmapArea(client, params["AI"]);
    if (params["DAR"]) mapObject.rank = params["DAR"];
    const originOwner = client.worldmaps._ownerInfoData.parseOwnerInfo(params["SO"])
    const targetOwner = client.worldmaps._ownerInfoData.parseOwnerInfo(params["OI"])
    if (params["RS"]) {
        mapObject.attackCooldownEnd = new Date(Date.now() + params["RS"] * 1000);
        mapObject.isVisibleOnMap = true;
    }
    const spyResources = [];
    if (params["R"]) {
        for (let r of params["R"]) {
            spyResources.push(new Good(client, r));
        }
    }
    const armyInfo = params["S"] == null ? null : parseSpyArmyInfo(client, params);
    const shapeshifterId = params["SSID"];
    if (shapeshifterId) {
        const playerName = Localize.text(client, `shapeshifter_castleName_${shapeshifterId - 1}`);
        parseInt(params["SID"]) < 0 ? (originOwner.playerName = playerName) : (targetOwner.playerName = playerName);
        if (armyInfo && armyInfo.defenderBaron) {
            armyInfo.defenderBaron.shapeshifterId = shapeshifterId;
        }
    }
    socket[`bsd -> ${params.MID}`] = {
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
        shapeshifterId: shapeshifterId,
    };
}

/**
 *
 * @param {Client} client
 * @param {Object} data
 * @returns {Mapobject}
 */
function parseWorldmapArea(client, data) {
    return parseMapObject(client, [data["AT"]]).parseAreaInfoBattleLog(data);
}

/**
 *
 * @param {Client} client
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
 *
 * @param {number} flankId
 * @param {Array} paramArray
 * @return {InventoryItem[]}
 */
function parseSingleFlank(flankId, paramArray) {
    const flankUnits = [];
    for (let unit_count of paramArray[flankId]) {
        flankUnits.push(new InventoryItem(unit_count[0], unit_count[1]));
    }
    return flankUnits;
}