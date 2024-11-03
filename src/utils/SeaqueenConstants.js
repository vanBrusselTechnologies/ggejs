const Crest = require("../structures/Crest");
const ConstantsColors = require("./ConstantsColors");

const ASSET_ID_PREFIX = "map_seaqueen_";
const FLIP_MODIFIER = "flipped";
const LIMITS_MODIFIER = "limit";
const ROUTE_START_MODIFIER = "start";
const ROUTE_END_MODIFIER = "end";
const ISLAND_OCCUPIED_MODIFIER = "good";
const SHIP_UNLOCKED_MODIFIER = "activ";
const SHIP_LOCKED_MODIFIER = "inactiv";
const SHIP_COOLDOWN_MODIFIER = "destroyed";
const DUNGEON_REATTACKABLE_MODIFIER = "reattackable";
const DUNGEON_COOLDOWN_MODIFIER = "cooldown";
const DUNGEON_UNDEFEATED_MODIFIER = "undefeated";
const SUBTYPE_ISLAND_BASE = "base";
const SUBTYPE_CASTLE_BIG = "2";
const TYPE_CAMP = 0;
const TYPE_ISLAND = 1;
const TYPE_CASTLE = 2;
const TYPE_SHIP = 3;
const TYPE_FOG = 4;
const TYPE_LONGISLAND = 5;
const TYPE_ROCKS = 6;
const TYPE_KRAKEN = 7;
const TYPE_ROUTE = 8;
const TYPE_CLOUD = 9;
const TYPE_KRAKEN_STAND = 10;

module.exports.assetIDs = ["tent", "island", "towers", "ship", "fog", "long_island", "rocks", "kraken", "", "cloud_big", "kraken_stand"];

module.exports.mapTypes = {
    "camp": 0,
    "island": 1,
    "ship": 3,
    "fog": 4,
    "islandLong": 5,
    "rocks": 6,
    "kraken": 7,
    "krakenStand": 10,
    "route": 8,
    "castle": 2,
    "cloud": 9
};

const ACTIVE_CASTLE_OUTLINE_COLOR = 13369344;
const nodeEntityTypes = [0, 1, 2, 3, 4, 7];
const NPC_SYMBOL = 100005;

/** @type {Crest} */
module.exports.NPC_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = NPC_SYMBOL;
    crest.symbolColor1 = 0;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.SEA_QUEEN_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();

const ID_SHIP_LEVEL1 = 900311;
const ID_SHIP_LEVEL2 = 900312;
const ID_SHIP_LEVEL3 = 900313;
const ID_SHIP_LEVEL4 = 900314;
const ID_SHIP_LEVEL5 = 900315;
const ID_SHIPS = {
    1: ID_SHIP_LEVEL1, 2: ID_SHIP_LEVEL2, 3: ID_SHIP_LEVEL3, 4: ID_SHIP_LEVEL4, 5: ID_SHIP_LEVEL5,
}

/**
 * @param {number} type
 * @return {boolean}
 */
module.exports.isNodeEntityType = (type) => {
    return nodeEntityTypes.indexOf(type) !== -1;
}

/**
 *
 * @param {string} nodeType
 * @param {boolean} isSurroundingDungeon
 * @param {boolean} isEndNode
 * @return {number}
 */
module.exports.getMapObjectTypeByNode = (nodeType, isSurroundingDungeon, isEndNode) => {
    switch (nodeType) {
        case "DUNGEON":
            if (isSurroundingDungeon) return 3;
            if (isEndNode) return 7;
            return 2;
        case "BRIDGEDUNGEON":
            return 3;
        default:
            console.error(`received unknown node type:${nodeType}`)
            return 0;
    }
}

/**
 *
 * @param {number} shipLevel
 * @return {number}
 */
module.exports.getShipWodIdByLevel = (shipLevel) => {
    return ID_SHIPS[shipLevel];
}