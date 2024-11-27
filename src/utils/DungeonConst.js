module.exports.FACTOR_VICTORY_LEVEL = 1.9;
module.exports.POWER_VICTORY_LEVEL = 0.555;
module.exports.COOLDOWN = 10800;
module.exports.DUNGEON_PLAYER_ID = -202;
module.exports.DUNGEON_PLAYER_NAME_COUNT = 13;
module.exports.KINGDOM_DUNGEON_PLAYER_ID = -220;
module.exports.KINGDOM_BOSS_DUNGEON_PLAYER_ID = -230;
module.exports.BLUE_FACTION_KING = -410;
module.exports.RED_FACTION_KING = -411;
module.exports.RANDOM_DUNGEON_EVENT_PLAYER_ID = -500;
module.exports.APRIL_DUNGEON_EVENT_PLAYER_ID = -501;
module.exports.ST_PATRICKS_DAY_DUNGEON_EVENT_PLAYER_ID = -502;
module.exports.EASTER_DUNGEON_EVENT_PLAYER_ID = -503;
module.exports.RANDOM_DUNGEON_MAX_GUARDS = 50;
module.exports.BASIC_NOMAD_CAMP_PLAYER_ID = -601;
module.exports.BASIC_SAMURAI_CAMP_PLAYER_ID = -651;
module.exports.BASIC_INVASION_CAMP_PLAYER_ID = -701;
module.exports.BASIC_ALIEN_ID = -1000;
module.exports.BASIC_SAMURAI_ALIEN_ID = -1001;
module.exports.BASIC_RED_ALIEN_ID = -1002;
module.exports.BASIC_ALLIANCE_NOMAD_CAMP_PLAYER_ID = -801;
module.exports.BASIC_DAIMYO_CASTLE_PLAYER_ID = -811;
module.exports.BASIC_DAIMYO_TOWNSHIP_PLAYER_ID = -815;
module.exports.BASIC_TEMPSERVER_CHARGE_CAMP_PLAYER_ID = -821;
module.exports.BASIC_COLLECTOR_PLAYER_ID = -1100;
module.exports.BASIC_ALLIANCE_BATTLE_GROUND_RESOURCE_TOWER_PLAYER_ID = -1200;
module.exports.BASIC_WOLF_KING_PLAYER_ID = -1201;
module.exports.DUNGEON_SKIN_ROBBER_BARON_KING = 1;
module.exports.DUNGEON_SKIN_COW = 2;
module.exports.DUNGEON_SKIN_ST_PATRICKS_DAY = 3;
module.exports.DUNGEON_SKIN_EASTER = 4;
module.exports.NOMAD_CAMP_COUNT = 4;
module.exports.MESSAGE_FAKE_TUTORIAL_BATTLELOG_PID = -2;
module.exports.DUNGEON_DELETION_CLASSIC_FACTOR = 1;
module.exports.DUNGEON_DELETION_ICE_FACTOR = 2.2;
module.exports.DUNGEON_DELETION_DESERT_FACTOR = 3.5;
module.exports.DUNGEON_DELETION_VULCAN_FACTOR = 4;
module.exports.NO_LOW_LEVEL_DUNGEON_ATTACK = false;
module.exports.INVALID = -1;

/**
 * @param {number} skinId
 * @return {number}
 */
module.exports.getEventDungeonOwnerIDBySkinId = function (skinId) {
    switch (skinId - 1) {
        case 0:
            return -500;
        case 1:
            return -501;
        case 2:
            return -502;
        case 3:
            return -503;
        default:
            return -1;
    }
}

/** @return {number} */
module.exports.getEventDungeonDefaultOwnerId = function () {
    return -500;
}

/**
 * @param {number} kingdomId
 * @param {number} idOffset
 * @return {Number}
 */
module.exports.getDungeonOwnerId = function (kingdomId, idOffset) {
    if (kingdomId === 0) return -202 - idOffset;
    return -220 - (kingdomId - 1);
}

/**
 * @param {number} kingdomId
 * @return {number}
 */
module.exports.getBossDungeonOwnerId = function (kingdomId) {
    return -230 - (kingdomId - 1);
}

/**
 * @param {number} victories
 * @param {number} kingdomId
 * @return {number}
 */
module.exports.getLevel = function (victories, kingdomId) {
    return Math.floor(1.9 * Math.pow(Math.abs(victories), 0.555)) + getKingdomOffset(kingdomId);
}

/**
 * @param {number} costFor180Minutes
 * @param {number} remainingTimeInSec
 * @return {number}
 */
module.exports.getSkipCost = function (costFor180Minutes, remainingTimeInSec) {
    return Math.max(1, costFor180Minutes * remainingTimeInSec / 180 / 60);
}

/**
 * @param {number} dungeonLevel
 * @param {number} kingdomId
 * @return {number}
 */
module.exports.getVictories = function (dungeonLevel, kingdomId) {
    return Math.floor(Math.pow((dungeonLevel - getKingdomOffset(kingdomId) + 1) / 1.9, 1.8018018018018016));
}

/**
 * @param {number} kingdomId
 * @return {number}
 */
function getKingdomOffset(kingdomId) {
    switch (kingdomId) {
        case 0:
            return 1;
        case 1:
            return 35;
        case 2:
            return 20;
        case 3:
            return 45;
    }
    return 0;
}

/**
 * @param {number} dungeonLevel
 * @return {number}
 */
module.exports.getResources = function (dungeonLevel) {
    return Math.pow(dungeonLevel, 2.2) * 1.2 + 90;
}

/**
 *
 * @param {number} dungeonLevel
 * @return {number}
 */
module.exports.getC1 = function (dungeonLevel) {
    if (dungeonLevel >= 61) return Math.pow(dungeonLevel, 1.1) * 210;
    return Math.pow(dungeonLevel, 2.1) * 3.5 + 25;
}

/**
 *
 * @param {number} dungeonLevel
 * @return {number}
 */
module.exports.getC2 = function (dungeonLevel) {
    return Math.max(0, (Math.random() * 11 - 5 + dungeonLevel * 0.5 + 0.7) * 0.5);
}

/**
 *
 * @param {number} dungeonLevel
 * @return {number}
 */
module.exports.getC2Probability = function (dungeonLevel) {
    if (dungeonLevel >= 3) return 50;
    return 0;
}

/**
 *
 * @param {number} dungeonLevel
 * @return {number}
 */
module.exports.getWallUpgradeByLevel = function (dungeonLevel) {
    if (dungeonLevel < 11) return 1;
    if (dungeonLevel < 24) return 2;
    return 3;
}

/**
 *
 * @param  {number} dungeonLevel
 * @return {number}
 */
module.exports.getWallWOD = function (dungeonLevel) {
    if (dungeonLevel < 11) return 501;
    if (dungeonLevel < 24) return 502;
    return 503;
}

/**
 *
 * @param {number} dungeonLevel
 * @return {number}
 */
module.exports.getGateWOD = function (dungeonLevel) {
    if (dungeonLevel < 11) return 450;
    if (dungeonLevel < 24) return 451;
    return 452;
}

/**
 *
 * @param {number} victories
 * @param {number} kingdomId
 * @return {number}
 */
module.exports.getGuards = function (victories, kingdomId) {
    const level = module.exports.getLevel(victories, kingdomId);
    return Math.max(0, Math.min(50, Math.round(0.06 * (level - 4) * (level - 4) + 0.5 * (level - 4))));
}