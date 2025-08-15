const NAME = "sge";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseSGE(client, params);
    require('.').baseExecuteCommand(client, undefined, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} gemId
 * @param {boolean} isRelicGem
 * @param {number} lostAndFoundRewardId
 */
module.exports.sellGem = function (client, gemId, isRelicGem, lostAndFoundRewardId = -1) {
    const C2SSellGemVO = {GID: gemId, RGEM: isRelicGem ? 1 : 0, LFID: lostAndFoundRewardId};
    return require('.').baseSendCommand(client, NAME, C2SSellGemVO, callbacks, () => true);
}

module.exports.sge = parseSGE;

/**
 * @param {BaseClient} client
 * @param {{}} params
 */
function parseSGE(client, params) {
}