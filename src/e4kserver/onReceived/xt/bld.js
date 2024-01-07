const LogUnit = require("../../../structures/LogUnit");
module.exports.name = "bld"
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const client = socket.client;
    const supportTools = parseSupportToolsDetails(client, params.S);
    const yard = parseYardDetailed(client, params.Y);
    const waves = parseWavesDetails(client, params.W);
    socket[`bld -> ${params.LID}`] = {
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
 * @param {Client} client
 * @param {Array} params
 * @returns {{attacker: {tools: LogUnit[]}, defender: {tools: LogUnit[]}}}
 */
function parseSupportToolsDetails(client, params) {
    if (!params || params.length === 0) return;
    const output = {attacker: [], defender: []};
    params[0].shift();
    output.attacker = parseTools(client, params[0]);
    if (!params[1] || params[1].length === 0) return;
    params[1].shift();
    output.defender = parseTools(client, params[1]);
    return output;
}

/**
 * @param {Client} client
 * @param {Array} params
 * @returns {{attacker: {soldiers: LogUnit[]}, defender: {soldiers: LogUnit[][]}}}
 */
function parseYardDetailed(client, params) {
    if (!params || params.length === 0) return;
    const output = {attacker: [], defender: []};
    params[0].shift();
    output.attacker = parseUnits(client, params[0]);
    if (!params[1] || params[1].length === 0) return;
    params[1].shift();
    output.defender = parseUnits(client, params[1]);
    return output;
}

/**
 * @param {Client} client
 * @param {Array} params
 * @returns {{attacker: BattleLogArmyWave[], defender: BattleLogArmyWave[]}}
 */
function parseWavesDetails(client, params) {
    const output = {attacker: [], defender: []};
    if (params.length === 0) return;
    for (let wave of params) {
        const flanksAtt = [];
        wave[0].shift();
        for (let flank of wave[0]) {
            flanksAtt.push({soldiers: parseUnits(client, flank[0]), tools: parseTools(client, flank[1])})
        }
        output.attacker.push({left: flanksAtt[0], middle: flanksAtt[0], right: flanksAtt[0]});
        const flanksDef = [];
        wave[1].shift();
        for (let flank of wave[1]) {
            flanksDef.push({soldiers: parseUnits(client, flank[0]), tools: parseTools(client, flank[1])})
        }
        output.defender.push({left: flanksDef[0], middle: flanksDef[0], right: flanksDef[0]});
    }
    return output;
}

/**
 * @param {Client} client
 * @param {Array} params
 * @returns {{attacker: {soldiers: LogUnit[]}}}
 */
function parseFinalWaveDetails(client, params) {
    const output = {attacker: []};
    if (params && params.length > 0) {
        params[0].shift();
        output.attacker = parseUnits(client, params);
    }
    return output;
}

/**
 * @param {Client} client
 * @param {number[][]} param
 * @return {LogUnit[]}
 */
function parseUnits(client, param) {
    const units = [];
    if (param && param.length > 0) {
        if (typeof param[0] === 'number') {
            if (param.length >= 3) units.push(parseData(param));
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
 * @param {Client} client
 * @param {number[][]} param
 * @return {LogUnit[]}
 */
function parseTools(client, param) {
    const tools = [];
    if (param == null) return tools;
    for (let data of param) {
        if (data.length >= 3) tools.push(parseData(client, data));
    }
    return tools;
}

/**
 *
 * @param {Client} client
 * @param {Array} data
 * @return {LogUnit}
 */
function parseData(client, data) {
    return new LogUnit(client, data[0], data[1], data[2]);
}