const Constants = require("../utils/Constants");

const NAME = "dms";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseDMS(client, params);
    require('.').baseExecuteCommand(undefined, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number[]} messageIds
 * @return {Promise<void>}
 */
module.exports.deleteMessages = function (client, messageIds) {
    const C2SDeleteMessageVO = {MIDS: messageIds};
    return require('.').baseSendCommand(client, NAME, C2SDeleteMessageVO, callbacks, (p) => messageIds.includes(p?.["MIDS"]?.[0]));
}

module.exports.dms = parseDMS;

/**
 * @param {Client} client
 * @param {Object} params
 */
function parseDMS(client, params) {
    if (!params) return;
    if (params.MIDS) for (const mid of params.MIDS) removeAndEmit(client, mid);
    if (params.MID) for (const mid of params.MID) removeAndEmit(client, mid);
}

/**
 * @param {Client} client
 * @param {number} messageId
 */
function removeAndEmit(client, messageId) {
    for (let i = client._mailMessages.length - 1; i >= 0; i--) {
        if (client._mailMessages[i].messageId === messageId) {
            client.emit(Constants.Events.MAIL_MESSAGE_REMOVE, client._mailMessages[i]);
            client._mailMessages.splice(i, 1);
            break;
        }
    }
}