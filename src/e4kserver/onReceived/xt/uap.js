const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "uap",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        if(params["KID"] === 10){
            //
            //worldMapOwnerInfoData.ownInfoVO.updateFactionProtectionFromParamObject(params);
        }
        castleUserData.setKingdomNoobProtection(params["KID"], params["NS"]);
        if(params["NS"] > 0){
            castleUserData.noobProtected = true;
            castleUserData.noobProtectionEndTime = new Date(Date.now() + params["NS"] * 1000);
        }
        else {
            castleUserData.noobProtected = false
        }
        castleUserData.peaceModeStatus = params["PMS"];
        if(params["PMT"] > 0){
            castleUserData.peaceProtectionStatusEndTime = new Date(Date.now() + params["PMT"] * 1000);
        }
    }
}