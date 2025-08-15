module.exports.name = "gpf";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.hasPremiumFlag = params["PF"] === 1 || params["PF"];
}