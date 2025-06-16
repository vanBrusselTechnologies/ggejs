const Constants = require("../../../utils/Constants");

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
    if (client._socket['mailMessages'] === undefined) return;
    for (let i in client._socket['mailMessages']) {
        if (client._socket['mailMessages'][i].messageId === messageId) {
            client.emit(Constants.Events.MAIL_MESSAGE_REMOVE, client._socket['mailMessages'][i]);
            client._socket['mailMessages'].splice(i, 1);
            break;
        }
    }
}