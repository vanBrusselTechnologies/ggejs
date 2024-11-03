const FIRST_MAP_ID = 50;
const PROGRESS_NONE = 0;
const PROGRESS_FOUND_MAP_PIECE = 1;
const PROGRESS_DESTROYED_DUNGEON = 2;
const PROGRESS_NEW_MAP = 3;
const PROGRESS_DESTROYED_END_NODE = 4;
const MIN_LEVEL_FOR_FINDING_PIECES = 6;
const TRAVEL_BOOST_ARMY = 2;
const MAP_ID_THORNKING_EASY = 21;
const MAP_ID_THORNKING_HARD = 25;
const MAP_ID_SEAQUEEN_EASY = 22;
const MAP_ID_SEAQUEEN_HARD = 27;
const MAP_ID_SEAQUEEN_EXTRA_HARD = 28;
const MAP_ID_UNDERWORLD_EASY = 23;
const MAP_ID_UNDERWORLD_HARD = 24;
module.exports.CRUSADE_MAP_IDS = [21, 25, 22, 27, 28, 23, 24];
const STAGED_CRUSADE_MAPS = [23, 21];
const LOWLEVEL_UNDERWORLD_START_LEVEL = 10;
const LOWLEVEL_UNDERWORLD_STOP_LEVEL = 22;
const LOWLEVEL_UNDERWORLD_WARN_LEVEL = 29;
const LOWLEVEL_UNDERWORLD_KILL_LEVEL = 30;
const NODE_ID_HIDDEN_COW_DUNGEON = 165;
const NODE_ID_KRAKEN = 206;
const NODE_ID_THORNKING = 164;
const MAP_TYPE_CRUSADE = 0;
const MAP_TYPE_TREASURE_HUNT = 1;
const MAP_TYPE_CRUSADE_TIMED = 2;

/**
 *
 * @param {number} dungeonLevel
 * @param {number} treasureMapId
 * @param {number} difficulty
 * @return {number}
 */
function getTreasureMapDropChance(dungeonLevel, treasureMapId, difficulty) {
    if (treasureMapId === 50) return 0.5;
    const dropChance = (Math.pow(dungeonLevel - difficulty, 3) / 100 + 8) * 4 + 0.1 * dungeonLevel;
    return Math.round(Math.min(80, Math.max(5, dropChance))) / 100;
}