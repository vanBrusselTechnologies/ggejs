module.exports.name = "csl";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{SL:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return -1;
    return params.SL;
}