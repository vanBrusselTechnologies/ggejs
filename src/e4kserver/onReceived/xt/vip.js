module.exports = {
    name: "vip",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        /*
        (model = CastleVIPData)
         model.vipPoints = obj.VP;
         model.vipTimeExpireTimestamp = obj.VRS;
         model.usedPremiumGenerals = obj.UPG;
         model.maxVIPLevelReached = obj.VRL;
         */
    }
}