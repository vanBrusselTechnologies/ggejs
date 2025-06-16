module.exports.name = "tsc";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.logger.d('tsc', errorCode, params);
}