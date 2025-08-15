const ChatMessage = require("../structures/ChatMessage");

const NAME = "acm";
/** @type {CommandCallback<ChatMessage>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const chatMessage = parseACM(client, params);
    require('.').baseExecuteCommand(client, chatMessage, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {string} message
 * @return {Promise<ChatMessage>}
 */
module.exports.sendAllianceChat = function (client, message) {
    const C2SAllianceChatVO = {M: validateMessage(message)};
    return require('.').baseSendCommand(client, NAME, C2SAllianceChatVO, callbacks, () => true);
}

module.exports.acm = parseACM;

/**
 * @param {BaseClient} client
 * @param {{CM: Object}} params
 * @return {ChatMessage}
 */
function parseACM(client, params) {
    if (!params.CM) return null;
    const msg = new ChatMessage(client, params.CM);
    client.emit("chatMessage", msg);
    return msg;
}

/** @param {string} msg */
function validateMessage(msg) {
    msg = msg.replaceAll(/%/g, "&percnt;")
        .replaceAll(/'/g, "&#145;")
        .replaceAll(/"/g, "&quot;")
        .replaceAll(/</g, "&lt;")
        .replaceAll(/\r/g, "<br />")
        .replaceAll(/\n/g, "<br />")
        .replaceAll(/\\/g, "")
        .replaceAll(/\n/g, "")
        .replaceAll(/\x0b/g, "")
        .replaceAll(/\f/g, "")
        .replaceAll(/\r/g, "")
        .replaceAll(/\t/g, "");
    return msg;
}