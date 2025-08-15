module.exports.name = "lts";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{LTS:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.lifeTimeSpent = params.LTS;
}