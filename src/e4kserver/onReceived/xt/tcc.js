module.exports.name = "tcc";
/**
 *
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    console.log('tcc', errorCode, params);
}