module.exports.name = "gho";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.clientUserData.userHonor = params["H"];
    client.clientUserData.userRanking = params["RP"];
}
