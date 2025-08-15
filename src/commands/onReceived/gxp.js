const playerConst = require('../../utils/PlayerConst');

module.exports.name = "gxp";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const cud = client.clientUserData;
    const xp = params["XP"];
    const level = params["LVL"];
    const legendLevel = level >= 70 ? playerConst.getLegendLevelFromXP(xp) : 0;
    let xpCurrentLevel;
    let xpNextLevel;
    if (legendLevel > 0) {
        xpCurrentLevel = playerConst.getXPFromLegendLevel(legendLevel);
        xpNextLevel = playerConst.getXPFromLegendLevel(legendLevel + 1);
    } else {
        xpCurrentLevel = playerConst.getXPFromLegendLevel(level);
        xpNextLevel = playerConst.getXPFromLegendLevel(level + 1);
    }
    cud.userXp = xp;
    cud.userLevel = level;
    cud.userParagonLevel = legendLevel;
    cud.userXpCurrentLevel = xpCurrentLevel;
    cud.userXPtoNextLevel = xpNextLevel;
    cud.displayXP = cud.isLegendLevel() ? xp - 147000 : xp;
    cud.isXPDataInitialized = true;
}