module.exports.VILLAGE_UNSPAWNED_AREA_ID = -1;
module.exports.DEFAULT_OWNER_OFFSET = -400;

/**
 * @param {number} kingdomId
 * @return {number}
 */
module.exports.getVillageDefaultOwnerId = function (kingdomId) {
    return -400 - (kingdomId - 1);
}

/**
 * @param {number} pID
 * @return {boolean}
 */
module.exports.isVillagePlayer = function (pID) {
    return pID <= -400 && pID > -404;
}