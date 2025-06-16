module.exports.name = "gms";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{MS: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.clientUserData.maxSpies = params.MS;
}