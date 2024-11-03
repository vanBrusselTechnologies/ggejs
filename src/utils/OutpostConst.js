module.exports.SIEGE_TIME = 86400;
module.exports.DUMMY_SIEGE_TIME = 2;
module.exports.SIEGE_TIME_TEST = 600;
module.exports.DAMAGED_BUILDING_RATIO = 0.9;
module.exports.ABANDON_TIME = 86400;
module.exports.ABANDON_TIME_TEST = 3600;
module.exports.MIN_TIME_BEFORE_ABANDON = 259200;
module.exports.MIN_TIME_BEFORE_ABANDON_TEST = 300;
module.exports.ABANDON_CANCEL_TIME = 10800;
module.exports.ABANDON_CANCEL_TIME_TEST = 60;
module.exports.DEFAULT_NAME = "";
module.exports.OUTPOST_DEFAULT_OWNER_ID = -300;
module.exports.OUTPOST_DEFAULT_AREA_ID = -300;
module.exports.OUTPOST_DEFAULT_LEVEL = 5;
module.exports.CAPITAL_CLASSIC_DEFAULT_OWNER_ID = -432;
module.exports.CAPITAL_ICE_DEFAULT_OWNER_ID = -433;
module.exports.CAPITAL_DESSERT_DEFAULT_OWNER_ID = -434;
module.exports.CAPITAL_VOLCANO_DEFAULT_OWNER_ID = -435;
module.exports.CAPITAL_UNSPAWNED_AREA_ID = -301;
module.exports.CAPITAL_MAP_ICON = "333300";
module.exports.CAPITAL_NON_CLASSIC_FOOD_PRODUCERS = 2;
module.exports.CAPITAL_CLASSIC_FOOD_PRODUCERS = 3;
module.exports.METROPOL_DEFAULT_OWNER_ID = -440;
module.exports.METROPOL_UNSPAWNED_AREA_ID = -341;
module.exports.METROPOL_ALLIANCE_BATTLE_GROUND_MINED_OUT_AREA_ID = -342;
module.exports.METROPOL_MAP_ICON = "333300";
module.exports.METROPOL_FOOD_PRODUCERS = 3;
module.exports.KINGS_TOWER_DEFAULT_OWNER_ID = -450;
module.exports.KINGS_TOWER_UNSPAWNED_AREA_ID = -351;
module.exports.KINGS_TOWER_BONUS = 20;
module.exports.KINGS_TOWER_DEFAULT_LEVEL = 70;
module.exports.MONUMENT_DEFAULT_OWNER_ID = -460;
module.exports.MONUMENT_UNSPAWNED_AREA_ID = -353;
module.exports.MONUMENT_DEFAULT_LEVEL = 70;
module.exports.LABORATORY_CLASSIC_DEFAULT_OWNER_ID = -470;
module.exports.LABORATORY_ICE_OWNER_ID = -471;
module.exports.LABORATORY_DESERT_OWNER_ID = -472;
module.exports.LABORATORY_VOLCANO_OWNER_ID = -473;
module.exports.LABORATORY_UNSPAWNED_AREA_ID = -355;
module.exports.LABORATORY_DEFAULT_LEVEL = 70;
module.exports.LANDMARK_DEFAULT_LEVEL = 70;
module.exports.ALLIANCE_BATTLE_GROUND_DEFAULT_OWNER_ID = -480;
module.exports.ALLIANCE_BATTLE_GROUND_UNSPAWNED_AREA_ID = -481;
module.exports.RESOURCE_ISLE_DEFAULT_LEVEL = 70;

/**
 * @param {number} kingdomId
 * @return {number}
 */
module.exports.getCapitalDefaultOwnerFor = function (kingdomId) {
    switch (kingdomId) {
        case 0:
            return -432;
        case 1:
            return -434;
        case 2:
            return -433;
        case 3:
            return -435;
        default:
            return -432;
    }
}

/**
 * @param {number} pID
 * @return {boolean}
 */
module.exports.isCapitalDefaultOwner = function (pID) {
    return pID === -432 || pID === -433 || pID === -434 || pID === -435;
}

/**
 * @param {number} kingdomId
 * @return {number}
 */
module.exports.getLaboratoryDefaultOwnerFor = function (kingdomId) {
    switch (kingdomId) {
        case 0:
            return -470;
        case 1:
            return -472;
        case 2:
            return -471;
        case 3:
            return -473;
        default:
            return -470;
    }
}

/**
 * @param {number} pID
 * @return {boolean}
 */
module.exports.isLaboratoryDefaultOwner = function (pID) {
    return pID === -470 || pID === -471 || pID === -472 || pID === -473;
}