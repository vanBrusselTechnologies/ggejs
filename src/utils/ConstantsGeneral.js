const Crest = require("../structures/Crest");
const ConstantsColors = require("./ConstantsColors");

module.exports.MAX_STARS_REGULAR = 5;
module.exports.DIALOG_INN_OFFERINGS_COLUMNS = 3;
module.exports.DIALOG_INN_OFFERINGS_ROWS = 3;
module.exports.GENERAL_ID_NOT_SELECTED = -1;
module.exports.MIN_REWARDS_DRAW_AMOUNT = 1;
module.exports.MAX_REWARDS_DRAW_AMOUNT = 100;
module.exports.BUY_GENERAL_OFFERING_MAX_SLIDER_AMOUNT = 100;
module.exports.TOP_GENERALS_EFFECTS_TO_SHOW = 4;
module.exports.SUPPORTED_VIDEO_FORMAT = "flv";
module.exports.DEFAULT_VIDEO_LANGUAGE = "en";
const CREST_SYMBOL_TYPE_WOLFKING = 101101;

module.exports.NPC_CREST_WOLFKING = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = CREST_SYMBOL_TYPE_WOLFKING;
    crest.symbolColor1 = ConstantsColors.WOLF_KING_SYMBOL;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.WOLF_KING_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();