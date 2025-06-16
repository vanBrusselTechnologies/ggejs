module.exports.name = "tcc";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.logger.d('tcc', errorCode, params);
}