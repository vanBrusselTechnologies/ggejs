const Player = require("../../../structures/Player");
const Good = require("../../../structures/Good");
const {text} = require("../../../tools/Localize");
const InventoryItem = require("../../../structures/InventoryItem");
const Lord = require("../../../structures/Lord");
const General = require("../../../structures/General");
const {parseMapObject} = require("../../../utils/MapObjectParser");

module.exports = {
    name: "bsd", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (params == null) {
            socket[`bsd -> errorCode`] = errorCode;
            return;
        }
        const client = socket.client;
        const mapObject = parseWorldmapArea(client, params["AI"]);
        if (params["DAR"]) mapObject.rank = params["DAR"];
        const originOwner = new Player(client, {O: params["SO"]});
        const targetOwner = new Player(client, {O: params["OI"]});
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
            const playerName = text(client, `shapeshifter_castleName_${shapeshifterId - 1}`);
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
    let _loc5_ = data["S"];
    if (_loc5_ == null) return {};
    const unitsLeft = parseSingleFlank(0, _loc5_);
    const unitsMiddle = parseSingleFlank(1, _loc5_);
    const unitsRight = parseSingleFlank(2, _loc5_);
    const unitsKeep = parseSingleFlank(3, _loc5_);
    const unitsKeepInventory = parseSingleFlank(5, _loc5_);
    const unitsStronghold = parseSingleFlank(5, _loc5_);
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