const userData = require('./../../../structures/CastleUserData');
const playerConst = require('./../../../utils/PlayerConst');
const playerInfoModel = require('./../../../structures/PlayerInfoModel');

module.exports = {
    name: "gxp",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        userData.isXPDataInitialized = true;
        const xp = params["XP"];
        const level = params["LVL"];
        const legendLevel = level >= 70 ? playerConst.getLegendLevelFromXP(xp) : 0;
        let xpCurrentLevel;
        let xpNextLevel;
        if(legendLevel > 0){
            xpCurrentLevel = playerConst.getXPFromLegendLevel(legendLevel);
            xpNextLevel = playerConst.getXPFromLegendLevel(legendLevel + 1);
        }
        else {
            xpCurrentLevel = playerConst.getXPFromLegendLevel(level);
            xpNextLevel = playerConst.getXPFromLegendLevel(level + 1);
        }
        userData.userXp = xp;
        userData.userLevel = level;
        userData.userParagonLevel = legendLevel;
        userData.userXpCurrentLevel = xpCurrentLevel;
        userData.userXPtoNextLevel = xpNextLevel;
        userData.displayXP = userData.isParagon() ? xp - 147000 : xp;
        playerInfoModel.userLevel = level;
    }
}