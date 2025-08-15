const NAME = "sms";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseSMS(client, params);
    require('.').baseExecuteCommand(client, undefined, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {string} receiverName
 * @param {string} subject
 * @param {string} msg
 * @return {Promise<void>}
 */
module.exports.sendMessage = function (client, receiverName, subject, msg) {
    const C2SSendMessageVO = {
        RN: receiverName,
        MH: getValideSmartFoxJSONMailMessage(subject),
        TXT: getValideSmartFoxJSONMailMessage(msg)
    };
    return require('.').baseSendCommand(client, NAME, C2SSendMessageVO, callbacks, () => true);
}

module.exports.sms = parseSMS;

/**
 * @param {BaseClient} client
 * @param {{}} params
 */
function parseSMS(client, params) {
}

/** @param {string} value */
function getValideSmartFoxJSONMailMessage(value) {
    for (const char in ["\\+", "#", "<", ">", "\"", "\\$"]) {
        const regExp = new RegExp(`\\${char}`, "gs");
        value = value.replaceAll(regExp, "");
    }
    value = value.replaceAll(/%/g, "&percnt;");
    value = value.replaceAll(/'/g, "&#145;");
    value = value.replaceAll(/"/g, "&quot;");
    value = value.replaceAll(/\r/g, "<br />");
    value = value.replaceAll(/\\/g, "%5C");
    value = value.replaceAll(/\n/g, "<br />");
    return value.replaceAll(/\t/g, " ");
}