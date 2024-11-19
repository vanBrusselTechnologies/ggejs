module.exports.name = "sge";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {[]} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode !== 0) socket["sge -> errorCode"] = errorCode;
    if (!params) return;
    socket["sge -> sold"] = true;
}