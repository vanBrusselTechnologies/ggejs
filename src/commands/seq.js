const {execute: esl} = require("./onReceived/esl");
const {execute: gcu} = require("./onReceived/gcu");
const {execute: gli} = require("./onReceived/gli");

const NAME = "seq";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseSEQ(client, params);
    require('.').baseExecuteCommand(undefined, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} equipmentId
 * @param {number} lordId
 * @param {number} lostAndFoundRewardId
 * @returns {Promise<void>}
 */
module.exports.sellEquipment = function (client, equipmentId, lordId = -1, lostAndFoundRewardId = -1) {
    const C2SSellEquipmentVO = {EID: equipmentId, LID: lordId, LFID: lostAndFoundRewardId};
    return require('.').baseSendCommand(client, NAME, C2SSellEquipmentVO, callbacks, (_) => true);
}

module.exports.seq = parseSEQ;

/**
 * @param {Client} client
 * @param {{gli:{B: Object[], C: Object[]}, gcu:{C1: number, C2: number}, esl:{E: number, TE: number, G: number, TG: number}}} params
 */
function parseSEQ(client, params) {
    if (!params) return;
    if (params?.gli) gli(client, 0, params.gli);
    if (params?.gcu) gcu(client, 0, params.gcu);
    if (params?.esl) esl(client, 0, params.esl);
}