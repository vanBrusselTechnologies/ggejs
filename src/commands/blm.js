const General = require("../structures/General");
const Lord = require("../structures/Lord");

const NAME = "blm"
/** @type {CommandCallback<BattleLog>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const battleLog = parseBLM(client, params);
    require('.').baseExecuteCommand(battleLog, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} battleLogId
 * @return {Promise<BattleLog>}
 */
module.exports.getBattleLogMiddle = function (client, battleLogId) {
    const C2SBattleLogMiddleVO = {LID: battleLogId};
    return require('.').baseSendCommand(client, NAME, C2SBattleLogMiddleVO, callbacks, (p) => p["LID"] === battleLogId);
}

module.exports.blm = parseBLM;

/**
 * @param {Client} client
 * @param {Object} params
 * @return {BattleLog}
 */
function parseBLM(client, params) {
    if (!params) return null;
    /** @type {BattleLog} */
    const battleLog = client._socket[`${params.LID} battleLog`];
    delete client._socket[`${params.LID} battleLog`];
    const attackerLords = parseAttackerLords(client, params, battleLog);
    const defenderLords = parseDefenderLords(client, params, battleLog);
    return {
        battleLogId: params["LID"],
        messageId: params["MID"],
        attackerCommandant: attackerLords?.commandant,
        attackerGeneral: attackerLords?.general,
        attackerLegendSkills: attackerLords?.legendSkills,
        defenderBaron: defenderLords?.baron,
        defenderGeneral: defenderLords?.general,
        defenderLegendSkills: defenderLords?.legendSkills,
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
        if (battleLog?.attacker.playerId === client.clientUserData.playerId) {
            const lord2 = client.equipments.getCommandants().find(c => c.id === lord.id);
            lord.name = !!lord2 ? lord2.name : "";
        }
        let general = null;
        if (lord.generalId != null && lord.generalId !== -1) {
            general = new General(client, data["AL"]);
            general.abilitiesPerWave = parseBattleLogGeneralAbilitiesPerWave(data["AA"]);
            lord.generalId = general.generalId;
        }
        return {
            commandant: lord, general: general, legendSkills: data["ALS"] ?? [],
        };
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
        if (battleLog?.defender.playerId === client.clientUserData.playerId) {
            const lord2 = client.equipments.getBarons().find(b => b.id === lord.id);
            lord.name = lord2 ? lord2.name : "";
        }
        let general = null;
        if (lord.generalId != null && lord.generalId !== -1) {
            general = new General(client, data["DB"]);
            general.abilitiesPerWave = parseBattleLogGeneralAbilitiesPerWave(data["AA"]);
            lord.generalId = general.generalId;
        }
        return {
            baron: lord, general: general, legendSkills: data["DLS"] ?? [],
        };
    }
}

/**
 * @param {Object} data
 * @return {{[key: number]: {abilityId: number, waveId: number, abilityValue: number}}}
 */
function parseBattleLogGeneralAbilitiesPerWave(data) {
    let abilityId = 0;
    let waveAndAbilityValues = [];
    const abilitiesPerWave = {};
    for (const item of data) {
        abilityId = item[0];
        waveAndAbilityValues = item[1];
        for (const val of waveAndAbilityValues) {
            const generalLogAbilityVO = {abilityId: abilityId, waveId: val[0], abilityValue: val[1]}
            const waveId = `${generalLogAbilityVO.waveId}`;
            if (abilitiesPerWave[waveId] == null) abilitiesPerWave[waveId] = [];
            abilitiesPerWave[waveId].push(generalLogAbilityVO);
        }
    }
    return abilitiesPerWave;
}