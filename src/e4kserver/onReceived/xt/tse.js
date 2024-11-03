module.exports.name = "tse";
/**
 *
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    socket["currentServerType"] = params.GST;
}