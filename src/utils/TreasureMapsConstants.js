const TreasureMapsConst = require('./TreasureMapsConst')

const NPC_ID = 1234;
const START_NODE_ID = 0;
const NODE_TYPE_START = "START";

/**
 * @param {number} mapId
 * @return {string}
 */
module.exports.getMapInterfaceNameByMapId = (mapId) => {
    if (mapId === 22 || mapId === 27 || mapId === 28) return "SeaQueen_SeaMap";
    return "";
}

/**
 * @param {number} spaceId
 * @return {boolean}
 */
module.exports.isSeasonEventMap = (spaceId) => {
    return TreasureMapsConst.CRUSADE_MAP_IDS.indexOf(spaceId) > -1;
}