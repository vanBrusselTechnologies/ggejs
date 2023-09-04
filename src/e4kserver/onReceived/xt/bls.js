const Player = require("../../../structures/Player");
const Equipment = require("../../../structures/Equipment");
const RelicEquipment = require("../../../structures/RelicEquipment");
const Gem = require("../../../structures/Gem");
const BattleParticipant = require("../../../structures/BattleParticipant");
const Lord = require("../../../structures/Lord");
const General = require("../../../structures/General");
const {parseMapObject} = require("../../../utils/MapObjectParser");
const Good = require("../../../structures/Good");
const {currencyMinutesSkipValues: minutesSkips} = require('e4k-data').data;

module.exports = {
    name: "bls", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (!params) return;
        const _client = socket.client;
        /** @type {Player[]} */
        let players = [];
        for (let p of params["PI"]) {
            players.push(new Player(_client, {O: p}));
        }
        const pbiInfo = parsePBIinfo(_client, params["PBI"], params);
        const isDefenseReport = socket[`${params.MID} battleLogMessage`]?.isDefenseReport;
        delete socket[`${params.MID} battleLogMessage`];
        const attackerLords = parseAttackerLords(socket.client, params, {attacker: pbiInfo.attacker});
        const defenderLords = parseDefenderLords(socket.client, params, {defender: pbiInfo.defender});
        const autoSkips = parseAutoSkip(socket.client, params);
        socket[`bls -> ${params.MID}`] = {
            battleLogId: params["LID"],
            messageId: params["MID"],
            messageType: params["MT"],
            mapobject: parseWorldmapArea(_client, params["AI"]),
            attacker: pbiInfo.attacker,
            defender: pbiInfo.defender,
            winner: pbiInfo.winner,
            loser: pbiInfo.loser,
            players: players,
            defWon: params["DW"],
            honor: params["H"],
            survivalRate: params["SR"],
            ragePoints: params["RP"],
            shapeshifterPoints: params["SSP"],
            shapeshifterId: params["SSID"],
            rewardEquipment: params["EQF"] == null ? null : params["EQF"][11] === 3 ? new RelicEquipment(_client, params["EQF"]) : new Equipment(_client, params["EQF"]),
            rewardGemId: params["GF"] == null ? null : new Gem(_client, params["GF"]),
            rewardMinuteSkips: params["MSF"] == null ? null : minutesSkips.find(ms => ms.MinuteSkipIndex === params["MSF"] - 1),
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
            isTempServerChargeAttack: params["CRO"] === 1,
            winnerChargeRankOld: isDefenseReport ? params["DCRO"] : params["CRO"],
            winnerChargeRankNew: isDefenseReport ? params["DCRN"] : params["CRN"],
            winnerChargePointsOld: isDefenseReport ? params["DCPO"] : params["CPO"],
            winnerChargePointsNew: isDefenseReport ? params["DCPN"] : params["CPN"],
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
 * @param {Array} data
 * @param {Object} battleLogParams
 * @return {{winner: BattleParticipant, loser: BattleParticipant, attacker: BattleParticipant, defender: BattleParticipant}}
 */
function parsePBIinfo(client, data, battleLogParams) {
    /** @type {BattleParticipant[]} */
    let players = [];
    for (let p of data) {
        players.push(new BattleParticipant(client, p))
    }
    let winnerIndex = battleLogParams["DW"] && players[0].front === 1 || !battleLogParams["DW"] && players[0].front === 0 ? 0 : 1;
    let loserIndex = 1 - winnerIndex;
    return {
        winner: players[winnerIndex], loser: players[loserIndex], attacker: players[0], defender: players[1],
    }
}


/**
 *
 * @param {Client} client
 * @param {object} data
 * @param {BattleLog} battleLog
 * @return {{commandant: Lord, general: Lord, legendSkills: int[]}}
 */
function parseAttackerLords(client, data, battleLog) {
    if (data["AL"]) {
        const lord = new Lord(client, data["AL"]);
        if (battleLog.attacker.playerId === client.players._thisPlayerId) {
            const lord2 = client.equipments.getCommandants().find(c => c.id === lord.id);
            lord.name = !!lord2 ? lord2.name : "";
        }
        let general = null;
        if (lord.generalId != null && lord.generalId !== -1) {
            general = new General(client, data["AL"]);
            lord.generalId = general.generalId;
        }
        return {
            commandant: lord, general: general, legendSkills: data["ALS"] ?? [],
        };
    }
}

/**
 *
 * @param {Client} client
 * @param {object} data
 * @param {BattleLog} battleLog
 * @return {{baron: Lord, general: Lord, legendSkills: int[]}}
 */
function parseDefenderLords(client, data, battleLog) {
    if (data["DB"]) {
        const lord = new Lord(client, data["DB"]);
        if (battleLog.defender.playerId === client.players._thisPlayerId) {
            const lord2 = client.equipments.getBarons().find(b => b.id === lord.id);
            lord.name = lord2 ? lord2.name : "";
        }
        let general = null;
        if (lord.generalId != null && lord.generalId !== -1) {
            general = new General(client, data["DB"]);
            lord.generalId = general.generalId;
        }
        return {
            baron: lord, general: general, legendSkills: data["DLS"] ?? [],
        };
    }
}

/**
 *
 * @param {Client} client
 * @param {object} data
 * @return {{autoSkipCooldownType:number, autoSkipMinuteSkips: Good[], autoSkipC2: number, autoSkipSeconds: number}}
 */
function parseAutoSkip(client, data) {
    if (data["ASCT"] !== undefined) {
        let _loc3_ = [];
        let _loc5_ = data["ASMS"];
        for (const _loc4_ of _loc5_) {
            _loc3_.push(new Good(_loc4_[0], _loc4_[1]));
        }
        return {
            autoSkipCooldownType: data["ASCT"],
            autoSkipMinuteSkips: _loc3_,
            autoSkipC2: data["ASC"],
            autoSkipSeconds: data["ASS"]
        }
    } else return {
        autoSkipCooldownType: -1, autoSkipMinuteSkips: [], autoSkipC2: -1, autoSkipSeconds: -1
    }
}