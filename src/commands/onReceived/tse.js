module.exports.name = "tse";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.socketManager.serverType = params.GST;
}