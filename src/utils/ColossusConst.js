const COIN_POINTS = 1;
const WOOD_POINTS = 2;
const STONE_POINTS = 3;
const MIN_POINTS = 50;

/**
 * @param {number} wood
 * @param {number} stone
 * @return {number}
 */
module.exports.calcResourcePointsForResources = function (wood, stone) {
    return wood * WOOD_POINTS + stone * STONE_POINTS;
}

/**
 * @param {number} c1
 * @return {number}
 */
module.exports.getResourcePointsForCoins = function (c1) {
    return COIN_POINTS * c1;
}

/**
 * @param {number} resourcePointsDivHundred
 * @return {number}
 */
module.exports.getDecoPoints = function (resourcePointsDivHundred) {
    if (resourcePointsDivHundred < MIN_POINTS) return 0;
    const decoPoints = 233 * Math.log(2.2 * resourcePointsDivHundred + 319) - 1320;
    if (decoPoints < 3000) {
        return Math.round(decoPoints);
    }
    return Math.round(decoPoints / 10 + 2700);
}