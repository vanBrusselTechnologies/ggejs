const Lord = require("../../../structures/Lord");
const General = require("../../../structures/General");
module.exports = {
    name: "blm", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        /** @type {BattleLog} */
        const battleLog = socket[`${params.LID} battleLog`];
        delete socket[`${params.LID} battleLog`];
        const attackerLords = parseAttackerLords(socket.client, params, battleLog);
        const defenderLords = parseDefenderLords(socket.client, params, battleLog);
        socket[`blm -> ${params.LID}`] = {
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
        if (battleLog?.attacker.playerId === client.players._thisPlayerId) {
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
 *
 * @param {Client} client
 * @param {object} data
 * @param {BattleLog} battleLog
 * @return {{baron: Lord, general: Lord, legendSkills: int[]}}
 */
function parseDefenderLords(client, data, battleLog) {
    if (data["DB"]) {
        const lord = new Lord(client, data["DB"]);
        if (battleLog?.defender.playerId === client.players._thisPlayerId) {
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
 *
 * @param {object} data
 * @return {{[key: number]: {abilityId: number, waveId: number, abilityValue: number}}}
 */
function parseBattleLogGeneralAbilitiesPerWave(data) {
    let abilityId = 0;
    let waveAndAbilityValues = [];
    let abilitiesPerWave = {};
    for (let item of data) {
        abilityId = item[0];
        waveAndAbilityValues = item[1];
        for (let val of waveAndAbilityValues) {
            let generalLogAbilityVO = {abilityId: abilityId, waveId: val[0], abilityValue: val[1]}
            const waveId = `${generalLogAbilityVO.waveId}`;
            if (abilitiesPerWave[waveId] == null) abilitiesPerWave[waveId] = [];
            abilitiesPerWave[waveId].push(generalLogAbilityVO);
        }
    }
    return abilitiesPerWave;
}