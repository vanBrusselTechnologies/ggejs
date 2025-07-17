const {currencyMinutesSkipValues, tmapnodes, tmaps} = require('e4k-data').data;
const BattleParticipant = require("../structures/BattleParticipant");
const Equipment = require("../structures/Equipment");
const Gem = require("../structures/Gem");
const General = require("../structures/General");
const Good = require("../structures/Good");
const Lord = require("../structures/Lord");
const TreasureMapMapobject = require("../structures/mapobjects/TreasureMapMapobject");
const RelicEquipment = require("../structures/RelicEquipment");
const {parseMapObject} = require("../utils/MapObjectParser");
const SeasonEventsConstants = require("../utils/SeasonEventsConstants");

const NAME = "bls";
/** @type {CommandCallback<BattleLog>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const battleLog = parseBLS(client, params);
    require('.').baseExecuteCommand(battleLog, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} messageId
 * @return {Promise<BattleLog>}
 */
module.exports.getBattleLogShort = function (client, messageId) {
    const C2SBattleLogShortVO = {MID: messageId};
    return require('.').baseSendCommand(client, NAME, C2SBattleLogShortVO, callbacks, (p) => p?.["MID"] === messageId);
}

module.exports.bls = parseBLS;

/**
 * @param {Client} client
 * @param {Object} params
 * @return {BattleLog}
 */
function parseBLS(client, params) {
    if (!params) return null;
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params["PI"]);
    const pbiInfo = parsePbiInfo(client, params["PBI"], params);
    const attackerLords = parseAttackerLords(client, params, {attacker: pbiInfo.attacker});
    const defenderLords = parseDefenderLords(client, params, {defender: pbiInfo.defender});
    const autoSkips = parseAutoSkip(client, params);

    const mapObject = parseWorldMapArea(client, params["AI"]);
    if (mapObject instanceof TreasureMapMapobject) {
        const mapSeed = String(params["MS"]).split("+").map(s => parseInt(s));
        /** @type {TreasureMapMapobject} */
        let treasureMapMapObject = mapObject;
        treasureMapMapObject.mapId = params["AI"]["MID"] ?? mapSeed[3];
        const tMap = tmaps.find(m => m.mapID === treasureMapMapObject.mapId);
        const tMapNode = tmapnodes.find(n => n.tmapnodeID === treasureMapMapObject.nodeId);
        treasureMapMapObject.isSurroundingDungeon = SeasonEventsConstants.isSurroundingDungeon(tMapNode.ownerID);
        treasureMapMapObject.isEndNode = tMap.endNodeID === tMapNode.tmapnodeID;
    }

    return {
        battleLogId: params["LID"],
        messageId: params["MID"],
        messageType: params["MT"],
        mapobject: mapObject,
        attacker: pbiInfo.attacker,
        defender: pbiInfo.defender,
        winner: pbiInfo.winner,
        loser: pbiInfo.loser,
        defWon: params["DW"] === 1,
        honor: params["H"],
        survivalRate: params["SR"],
        ragePoints: params["RP"],
        shapeshifterPoints: params["SSP"],
        shapeshifterId: params["SSID"],
        rewardEquipment: params["EQF"] == null ? null : params["EQF"][11] === 3 ? new RelicEquipment(client, params["EQF"]) : new Equipment(client, params["EQF"]),
        rewardGem: params["GF"] == null ? null : new Gem(client, params["GF"]),
        rewardMinuteSkips: params["MSF"] == null ? null : currencyMinutesSkipValues.find(ms => ms.MinuteSkipIndex === params["MSF"] - 1),
        attackerHomeCastleId: params["AHC"],
        attackerHadHospital: params["AHH"] === 1,
        isAttackerHospitalFull: params["AHF"] === 1,
        defenderHomeCastleId: params["DHC"],
        defenderHadHospital: params["DHH"] === 1,
        isDefenderHospitalFull: params["DHF"] === 1,
        attackerAllianceSubscribers: params["AAS"],
        defenderAllianceSubscribers: params["DAS"],
        attackerHasIndividualSubscription: params["AHP"] === 1,
        defenderHasIndividualSubscription: params["DHP"] === 1,
        allianceName: params["N"],
        attackerCommandant: attackerLords?.commandant,
        attackerGeneral: attackerLords?.general,
        attackerLegendSkills: attackerLords?.legendSkills,
        defenderBaron: defenderLords?.baron,
        defenderGeneral: defenderLords?.general,
        defenderLegendSkills: defenderLords?.legendSkills,
        autoSkipCooldownType: autoSkips.autoSkipCooldownType,
        autoSkipMinuteSkips: autoSkips.autoSkipMinuteSkips,
        autoSkipC2: autoSkips.autoSkipC2,
        autoSkipSeconds: autoSkips.autoSkipSeconds,
    };
}

/**
 * @param {Client} client
 * @param {Object} data
 */
function parseWorldMapArea(client, data) {
    return parseMapObject(client, [data["AT"]]).parseAreaInfoBattleLog(data);
}

/**
 * @param {Client} client
 * @param {Array} data
 * @param {Object} battleLogParams
 * @return {{winner: BattleParticipant, loser: BattleParticipant, attacker: BattleParticipant, defender: BattleParticipant}}
 */
function parsePbiInfo(client, data, battleLogParams) {
    /** @type {BattleParticipant[]} */
    const battleParticipants = [];
    for (let p of data) {
        battleParticipants.push(new BattleParticipant(client, p));
    }
    let winnerIndex = battleLogParams["DW"] && battleParticipants[0].front === 1 || !battleLogParams["DW"] && battleParticipants[0].front === 0 ? 0 : 1;
    let loserIndex = 1 - winnerIndex;
    return {
        winner: battleParticipants[winnerIndex],
        loser: battleParticipants[loserIndex],
        attacker: battleParticipants[0],
        defender: battleParticipants[1],
    }
}


/**
 * @param {Client} client
 * @param {Object} data
 * @param {BattleLog} battleLog
 * @return {{commandant: Lord, general: Lord, legendSkills: number[]}}
 */
function parseAttackerLords(client, data, battleLog) {
    if (data["AL"]) {
        const lord = new Lord(client, data["AL"]);
        if (battleLog.attacker.playerId === client.clientUserData.playerId) {
            const lord2 = client.equipments.getCommandants().find(c => c.id === lord.id);
            lord.name = !!lord2 ? lord2.name : "";
        }
        let general = null;
        if (lord.generalId != null && lord.generalId !== -1) {
            general = new General(client, data["AL"]);
            lord.generalId = general.generalId;
        }
        return {commandant: lord, general: general, legendSkills: data["ALS"] ?? []};
    }
}

/**
 * @param {Client} client
 * @param {Object} data
 * @param {BattleLog} battleLog
 * @return {{baron: Lord, general: Lord, legendSkills: number[]}}
 */
function parseDefenderLords(client, data, battleLog) {
    if (data["DB"]) {
        const lord = new Lord(client, data["DB"]);
        if (battleLog.defender.playerId === client.clientUserData.playerId) {
            const lord2 = client.equipments.getBarons().find(b => b.id === lord.id);
            lord.name = lord2 ? lord2.name : "";
        }
        let general = null;
        if (lord.generalId != null && lord.generalId !== -1) {
            general = new General(client, data["DB"]);
            lord.generalId = general.generalId;
        }
        return {baron: lord, general: general, legendSkills: data["DLS"] ?? []};
    }
}

/**
 * @param {Client} client
 * @param {Object} data
 * @return {{autoSkipCooldownType:number, autoSkipMinuteSkips: Good[], autoSkipC2: number, autoSkipSeconds: number}}
 */
function parseAutoSkip(client, data) {
    if (data["ASCT"] !== undefined) {
        let minuteSkips = [];
        for (const minuteSkipData of data["ASMS"]) {
            minuteSkips.push(new Good(minuteSkipData[0], minuteSkipData[1]));
        }
        return {
            autoSkipCooldownType: data["ASCT"],
            autoSkipMinuteSkips: minuteSkips,
            autoSkipC2: data["ASC"],
            autoSkipSeconds: data["ASS"]
        };
    } else return {
        autoSkipCooldownType: -1, autoSkipMinuteSkips: [], autoSkipC2: -1, autoSkipSeconds: -1
    };
}