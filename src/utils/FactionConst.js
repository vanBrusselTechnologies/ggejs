const KINGDOM_ID = 10;
const MAP_WIDTH_IN_SECTORS = 200;
const MAP_HEIGHT_IN_SECTORS = 10;
const SECTOR_WIDTH_IN_CAMPS = 4;
const SECTOR_HEIGHT_IN_CAMPS = 6;
const CAMP_SPOT_WIDTH = 3;
const CAMP_SPOT_HEIGHT = 2;
const BLUE_FACTION = 0;
const RED_FACTION = 1;
const VILLAGE_POINTS = 5;
const TOWER_POINTS = 15;
const CAPITAL_POINTS = 30;
const BURNING_BUILDING_MORAL = 10;
const START_GATE_WOD = 238;
const START_MAINTENT_WOD = 233;
const START_WALL_WOD = 234;
const START_TOWER_WOD = 272;
const START_WOOD = 3000;
const START_FOOD = 3000;
const START_STONE = 3000;
const TOWER_COOLDOWN = 10800;
const TOWER_COOLDOWN_TEST = 60;
const VILLAGE_COOLDOWN = 86400;
const VILLAGE_COOLDOWN_TEST = 60;
const BARON_ID = -16;
const DESTROYED_OCCUPIER_PLAYER_ID = -415;
const TOP_X = 100;
const MAJORITY_CAP = 1.2;
const FACTION_PROTECTION_STATUS_OFF = -1;
const FACTION_PROTECTION_STATUS_PRETIME = 0;
const FACTION_PROTECTION_STATUS_ACTIVE = 1;
const FACTION_PROTECTION_STATUS_COOLDOWN = 2;
const FACTION_ACTIVE_THRESHOLD = 250;
const TITLE_RESET_INTERVAL_SECONDS = 14400;
const FACTIONS = [BLUE_FACTION, RED_FACTION];

/**
 *
 * @param {number} factionId
 * @return {number}
 */
function getOppositeFactionID(factionId) {
    return factionId === 0 ? 1 : 0;
}

/** @return {number} */
module.exports.getMapWidth = () => 2600;
/** @return {number} */
module.exports.getMapHeight = () => 130;

/**
 * @param {number} mapSeed
 * @param {number} sectorX
 * @param {number} sectorY
 * @return {number}
 */
function getSectorSeed(mapSeed, sectorX, sectorY) {
    return mapSeed + 15 * sectorX + 31 * sectorY;
}

/**
 * @param {number} sectorX
 * @param {number} sectorY
 * @param {number[]} position
 * @return {boolean}
 */
function inSector(sectorX, sectorY, position) {
    const x = position[0];
    const y = position[1];
    const _loc6_ = sectorX * 4;
    const _loc7_ = sectorY * 6;
    return _loc6_ <= x && x < _loc6_ + 4 && _loc7_ <= y && y < _loc7_ + 6;
}

/**
 * @param {number} absoluteCampX
 * @return {number}
 */
module.exports.upperLeftWorldXFromAbsoluteCampX = (absoluteCampX) => {
    const _loc3_ = absoluteCampX / 4;
    const _loc2_ = absoluteCampX % 4;
    return _loc3_ * 13 + _loc2_ * 3;
}
/**
 * @param {number} absoluteCampY
 * @return {number}
 */
module.exports.upperLeftWorldYFromAbsoluteCampY = (absoluteCampY) => {
    const _loc2_ = absoluteCampY / 6;
    const _loc3_ = absoluteCampY % 6;
    return _loc2_ * 13 + _loc3_ * 2;
}

/**
 * @param {number} morale
 * @return {Number}
 */
function getMoraleModifier(morale) {
    if (morale >= 0) return 2 - 1 / (1 + Math.abs(morale) / 200);
    return 1 / (1 + Math.abs(morale) / 200);
}

/**
 * @param {boolean} isTest
 * @return {number}
 */
function getPeaceHeatup(isTest) {
    if (isTest) return 300;
    return 43200;
}

/**
 * @param {boolean} isTest
 * @return {number}
 */
function getPeaceDuration(isTest) {
    if (isTest) return 600;
    return 216000;
}

/**
 * @param {boolean} isTest
 * @return {number}
 */
function getPeaceCooldown(isTest) {
    if (isTest) return 300;
    return 345600;
}

/** @return {number} */
function getPeaceC2Cost() {
    return 7500;
}

/**
 * @param {number} factionStrengthFactor
 * @return {number}
 */
function getMoraleBoostFromFactionStrength(factionStrengthFactor) {
    if (factionStrengthFactor <= 0.49) return Math.round(Math.min(0.75, -13 * factionStrengthFactor + 6.5) * 100);
    return 0;
}

/**
 * @param {number} factionStrengthFactor
 * @return {number}
 */
function getCostReductionBonus(factionStrengthFactor) {
    if (factionStrengthFactor <= 0.49) return Math.round(Math.min(0.5, -10 * factionStrengthFactor + 5) * 100) / 100;
    return 0;
}

/**
 * @param {number} factionId
 * @return {number}
 */
function getIndexOfFactionID(factionId) {
    let _loc2_ = 0;
    while (_loc2_ < FACTIONS.length) {
        if (FACTIONS[_loc2_] === factionId) return _loc2_;
        _loc2_++;
    }
    return -1;
}

/**
 * @param {number} npcPlayerId
 * @return {number}
 */
function getNPCFactionID(npcPlayerId) {
    switch (npcPlayerId - -411) {
        case 0:
            return 1;
        case 1:
            return 0;
        default:
            return -1;
    }
}

/**
 * @param {number} factionId
 * @return {number}
 */
function getNpcPID(factionId) {
    switch (factionId) {
        case 0:
            return -410;
        case 1:
            return -411;
        default:
            return -1;
    }
}