/**
 *
 * @param {number} xp
 * @returns {number}
 */
module.exports.getLevelFromXP = function (xp) {
    return Math.min(70, Math.floor(Math.sqrt(xp / 30)));
}
/**
 *
 * @param {number} level
 * @returns {number}
 */
module.exports.getXPFromLevel = function (level) {
    return Math.min(147000, level * level * 30);
}
/**
 *
 * @param {number} xp
 * @returns {number}
 */
module.exports.getLegendLevelFromXP = function (xp) {
    const legendXp = xp - 147000;
    if (legendXp >= 0) {
        const legendLevel = Math.max(1, Math.floor(Math.pow((legendXp + 2750) / 3000, 0.8403361344537815)));
        return Math.min(950, legendLevel);
    }
    return 0;
}
/**
 *
 * @param {number} legendLevel
 * @returns {number}
 */
module.exports.getXPFromLegendLevel = function (legendLevel) {
    if (legendLevel < 1) {
        return 0;
    }
    legendLevel = Math.min(950, legendLevel);
    return Math.ceil(3000 * Math.pow(legendLevel, 1.19)) - 2750 + 147000;
}