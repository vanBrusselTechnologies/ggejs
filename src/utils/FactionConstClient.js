const ConstantsColors = require("./ConstantsColors");
const Crest = require("../structures/Crest");
const FactionConst = require("./FactionConst");

const INVALID_FACTION = -1;
const NPC_ID_TOWER_OWNER_BLUE = -998;
const NPC_ID_TOWER_OWNER_RED = -997;
const FACTION_DEFAULT_COLORS = [ConstantsColors.BLUE_FACTION_BACKGROUND, ConstantsColors.RED_FACTION_BACKGROUND, ConstantsColors.BLUE_FACTION_BACKGROUND, ConstantsColors.RED_FACTION_BACKGROUND];
//const FACTION_DEFAULT_CLIP_COLOR = [new CastleClipColor("flag",FACTION_DEFAULT_COLORS)];
const NPC_IDS = [NPC_ID_TOWER_OWNER_BLUE, NPC_ID_TOWER_OWNER_RED];
const CREST_SYMBOL_TYPE_BLUE = 101000;
const CREST_SYMBOL_TYPE_RED = 101100;
const NPC_CREST_BLUE = (function () {
    const crest = new Crest(null, null);
    crest.backgroundType = 0;
    crest.symbolPosType = 1;
    crest.symbolType1 = CREST_SYMBOL_TYPE_BLUE;
    crest.backgroundColor1 = ConstantsColors.BLUE_FACTION_BACKGROUND;
    crest.symbolColor1 = ConstantsColors.BLUE_FACTION_SYMBOL;
    crest.fillClipColor();
    return crest;
})();
const NPC_CREST_RED = (function () {
    const crest = new Crest(null, null);
    crest.backgroundType = 0;
    crest.symbolPosType = 1;
    crest.symbolType1 = CREST_SYMBOL_TYPE_RED;
    crest.backgroundColor1 = ConstantsColors.RED_FACTION_BACKGROUND;
    crest.symbolColor1 = ConstantsColors.RED_FACTION_SYMBOL;
    crest.fillClipColor();
    return crest;
})();
const FACTION_WALL_WOD_IDS = [234, 235, 278];
const FACTION_GATE_WOD_IDS = [238, 239, 292];
const FACTION_MOAT_WOD_IDS = [240, 0, 0, 0, 9, 241, 10];
const CREST_MAP = {
    0: NPC_CREST_BLUE, 1: NPC_CREST_RED,
}

/** @param {number} playerId */
function isFactionEventNPC(playerId) {
    return NPC_IDS.indexOf(playerId) >= 0;
}

/** @param {number} absX */
function getFactionIdForAbsX(absX) {
    const upperLeftWorldX = FactionConst.upperLeftWorldXFromAbsoluteCampX(absX);
    return upperLeftWorldX < FactionConst.getMapWidth() / 2 ? 1 : 0;
}

/**
 * @param {number} factionId
 * @return {Crest}
 */
module.exports.getCrestByFactionId = (factionId) => {
    return CREST_MAP[factionId];
}