const NPC_ID_THORNKING_DUNGEON = -700;
const NPC_ID_THORNKING_VILLAGE = -701;
const NPC_ID_THORNKING_COW_DUNGEON = -702;
const NPC_ID_SEAQUEEN_DUNGEON = -703;
const NPC_ID_SEAQUEEN_SHIPS = -704;
const NPC_ID_UNDERWORLD_DUNGEON = -706;
const NPC_ID_UNDERWORLD_VILLAGE = -707;
const SURROUNDING_DUNGEONS = [NPC_ID_SEAQUEEN_SHIPS];
const NPC_IDS = [NPC_ID_THORNKING_DUNGEON, NPC_ID_THORNKING_VILLAGE, NPC_ID_THORNKING_COW_DUNGEON, NPC_ID_SEAQUEEN_DUNGEON, NPC_ID_SEAQUEEN_SHIPS, NPC_ID_UNDERWORLD_DUNGEON, NPC_ID_UNDERWORLD_VILLAGE];

/**
 * @param {number} playerId
 * @return {boolean}
 */
module.exports.isSeasonEventNPC = (playerId) => {
    return NPC_IDS.indexOf(playerId) >= 0;
}

/**
 * @param {number} ownerId
 * @return {boolean}
 */
module.exports.isSurroundingDungeon = (ownerId) => {
    return SURROUNDING_DUNGEONS.indexOf(ownerId) > -1;
}