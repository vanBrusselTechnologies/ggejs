module.exports.name = "gms";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{MS: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.clientUserData.maxSpies = params.MS;
}