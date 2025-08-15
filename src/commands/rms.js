const {parseChatJSONMessage} = require("../tools/TextValide");

const NAME = "rms"
/** @type {CommandCallback<string>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const message = parseRMS(client, params);
    require('.').baseExecuteCommand(client, message, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} messageId
 * @return {Promise<string>}
 */
module.exports.readMessages = function (client, messageId) {
    const C2SReadMessagesVO = {MID: messageId};
    return require('.').baseSendCommand(client, NAME, C2SReadMessagesVO, callbacks, (p) => p?.["MID"] === messageId);
}

module.exports.rms = parseRMS;

/**
 * @param {BaseClient} client
 * @param {{MTXT: string}} params
 * @return {string | null}
 */
function parseRMS(client, params) {
    if (!params?.MTXT) return null;
    return parseChatJSONMessage(params.MTXT);
}