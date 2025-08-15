module.exports.name = "gal";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{AID: number, R:number, ACF: number, SA: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.allianceId = params.AID;
    client.clientUserData.allianceRank = params.R;
    client.clientUserData.allianceCurrentFame = params.ACF;
    client.clientUserData.isSearchingAlliance = params.SA === 1;
}