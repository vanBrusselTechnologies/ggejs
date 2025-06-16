module.exports.name = "mvf";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{AF: number[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.activeMovementFilters = params.AF
}