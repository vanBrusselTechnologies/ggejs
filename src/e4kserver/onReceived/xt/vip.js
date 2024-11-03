module.exports.name = "vip";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{VP:number,VRS:number,UPG:number,VRL:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const cud = socket.client.clientUserData
    cud.vipPoints = params.VP;
    cud.vipTimeExpireTimestamp = params.VRS;
    cud.usedPremiumGenerals = params.UPG;
    cud.maxVIPLevelReached = params.VRL;
}