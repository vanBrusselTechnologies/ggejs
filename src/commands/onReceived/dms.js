const Constants = require("../../utils/Constants");

module.exports.name = "dms";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    if (params.MIDS) for (const mid of params.MIDS) removeAndEmit(client, mid);
    if (params.MID) for (const mid of params.MID) removeAndEmit(client, mid);

}

/**
 * @param {Client} client
 * @param {number} messageId
 */
function removeAndEmit(client, messageId) {
    for (let i in client._mailMessages) {
        if (client._mailMessages[i].messageId === messageId) {
            client.emit(Constants.Events.MAIL_MESSAGE_REMOVE, client._mailMessages[i]);
            client._mailMessages.splice(i, 1);
            break;
        }
    }
}