module.exports.name = "vip";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{VP:number,VRS:number,UPG:number,VRL:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const cud = client.clientUserData
    cud.vipPoints = params.VP;
    cud.vipTimeExpireTimestamp = params.VRS;
    cud.usedPremiumGenerals = params.UPG;
    cud.maxVIPLevelReached = params.VRL;
}