const Crest = require("../structures/Crest");
const {STORM_ISLAND_BACKGROUND} = require("./ConstantsColors");
const VillageConst = require("./VillageConst");

module.exports.KINGDOM_NAME = "Island";
module.exports.TITLE_ID_STORM_LORD = 1;
module.exports.TITLE_ID_SHADOW_MASTER = 5;
module.exports.STORM_LORD_REWARD_RANK_ID = -1;
module.exports.STORM_LORD_REWARD_TOP_X_VALUE = 1;
module.exports.NPC_ID_ISLAND_DUNGEON = -223;
module.exports.NPC_ID_ISLAND_VILLAGE = VillageConst.getVillageDefaultOwnerId(4);
module.exports.NPC_SYMBOL = 100006;
module.exports.NPC_CREST = (function () {
    const crest = new Crest(null, null);
    crest.backgroundType = 0;
    crest.symbolPosType = 1;
    crest.symbolType1 = 100006;
    crest.backgroundColor1 = STORM_ISLAND_BACKGROUND;
    crest.symbolColor1 = 16777215;
    crest.fillClipColor();
    return crest;
})();
module.exports.PLAYER_STATISTIC_IDS = [15, 16, 17, 18, 19, 20];