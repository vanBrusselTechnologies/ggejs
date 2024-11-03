const Crest = require("../structures/Crest");
const ConstantsColors = require("./ConstantsColors");

module.exports.NPC_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 100007;
    crest.symbolColor1 = ConstantsColors.UNDERWORLD_SYMBOL;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.UNDERWORLD_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();