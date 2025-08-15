const BattleLogUnit = require("../structures/BattleLogUnit");
const Unit = require("../structures/Unit");

const NAME = "bld";
/** @type {CommandCallback<BattleLog>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const battleLog = parseBLD(client, params);
    require('.').baseExecuteCommand(client, battleLog, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} battleLogId
 * @return {Promise<BattleLog>}
 */
module.exports.getBattleLogDetail = function (client, battleLogId) {
    const C2SBattleLogDetailVO = {LID: battleLogId};
    return require('.').baseSendCommand(client, NAME, C2SBattleLogDetailVO, callbacks, (p) => p?.["LID"] === battleLogId);
}

module.exports.bld = parseBLD;

/**
 * @param {BaseClient} client
 * @param {Object} params
 * @return {BattleLog}
 */
function parseBLD(client, params) {
    if (!params) return null;
    const supportTools = parseSupportToolsDetails(client, params.S);
    const yard = parseYardDetailed(client, params.Y);
    const waves = parseWavesDetails(client, params.W);
    return {
        courtyardAttacker: yard.attacker,
        courtyardDefender: yard.defender,
        wavesAttacker: waves.attacker,
        wavesDefender: waves.defender,
        finalWaveAttacker: parseFinalWaveDetails(client, params.RW).attacker,
        supportToolsAttacker: supportTools.attacker,
        supportToolsDefender: supportTools.defender,
    };
}

/**
 * @param {BaseClient} client
 * @param {Array} params
 */
function parseSupportToolsDetails(client, params) {
    /** @type {{attacker: BattleLogUnit[], defender: BattleLogUnit[]}} */
    const output = {attacker: [], defender: []};
    if (!params || params.length === 0) return output;
    params[0].shift();
    output.attacker = parseTools(client, params[0]);
    if (!params[1] || params[1].length === 0) return output;
    params[1].shift();
    output.defender = parseTools(client, params[1]);
    return output;
}

/**
 * @param {BaseClient} client
 * @param {Array} params
 */
function parseYardDetailed(client, params) {
    /** @type {{attacker: BattleLogUnit[], defender: BattleLogUnit[]}} */
    const output = {attacker: [], defender: []};
    if (!params || params.length === 0) return output;
    params[0].shift();
    output.attacker = parseUnits(client, params[0]);
    if (!params[1] || params[1].length === 0) return output;
    params[1].shift();
    output.defender = parseUnits(client, params[1]);
    return output;
}

/**
 * @param {BaseClient} client
 * @param {Array} params
 */
function parseWavesDetails(client, params) {
    /** @type {{attacker: BattleLogArmyWave[], defender: BattleLogArmyWave[]}} */
    const output = {attacker: [], defender: []};
    if (!params || params.length === 0) return output;
    for (let wave of params) {
        const flanksAtt = [];
        wave[0].shift();
        for (let flank of wave[0]) {
            flanksAtt.push({soldiers: parseUnits(client, flank[0]), tools: parseTools(client, flank[1])});
        }
        output.attacker.push({left: flanksAtt[0], middle: flanksAtt[0], right: flanksAtt[0]});
        const flanksDef = [];
        wave[1].shift();
        for (let flank of wave[1]) {
            flanksDef.push({soldiers: parseUnits(client, flank[0]), tools: parseTools(client, flank[1])});
        }
        output.defender.push({left: flanksDef[0], middle: flanksDef[0], right: flanksDef[0]});
    }
    return output;
}

/**
 * @param {BaseClient} client
 * @param {Array} params
 */
function parseFinalWaveDetails(client, params) {
    /** @type {{attacker: BattleLogUnit[]}} */
    const output = {attacker: []};
    if (params && params.length > 0) {
        params[0].shift();
        output.attacker = parseUnits(client, params);
    }
    return output;
}

/**
 * @param {BaseClient} client
 * @param {number[][]} param
 */
function parseUnits(client, param) {
    /** @type {BattleLogUnit[]} */
    const units = [];
    if (param && param.length > 0) {
        if (typeof param[0] === 'number') {
            if (param.length >= 3) units.push(parseData(client, param));
        }
        if (Array.isArray(param[0])) {
            for (let data of param) {
                if (data.length >= 3) units.push(parseData(client, data));
            }
        }
    }
    return units;
}

/**
 * @param {BaseClient} client
 * @param {number[][]} param
 */
function parseTools(client, param) {
    /** @type {BattleLogUnit[]} */
    const tools = [];
    if (param == null) return tools;
    for (let data of param) {
        if (data.length >= 3) tools.push(parseData(client, data));
    }
    return tools;
}

/**
 * @param {BaseClient} client
 * @param {Array} data
 */
function parseData(client, data) {
    return new BattleLogUnit(new Unit(client, data[0]), data[1], data[2]);
}