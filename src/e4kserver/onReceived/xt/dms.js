const Constants = require("../../../utils/Constants");

module.exports.name = "dms";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    if (params.MIDS) for (let mid of params.MIDS) removeAndEmit(socket, mid);
    if (params.MID) for (let mid of params.MID) removeAndEmit(socket, mid);

}

/**
 * @param {Socket} socket
 * @param {number} messageId
 */
function removeAndEmit(socket, messageId) {
    if (socket['mailMessages'] === undefined) return;
    for (let i in socket['mailMessages']) {
        if (socket['mailMessages'][i].messageId === messageId) {
            socket.client.emit(Constants.Events.MAIL_MESSAGE_REMOVE, socket['mailMessages'][i]);
            socket['mailMessages'].splice(i, 1);
            break;
        }
    }
}