module.exports.name = "tsc";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    console.log('tsc', errorCode, params);
}