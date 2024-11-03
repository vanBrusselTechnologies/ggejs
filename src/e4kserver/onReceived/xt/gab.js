module.exports.name = "gab";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{B:number}} params
 * @returns {number}
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params?.B) return 0;
    return params.B;
}