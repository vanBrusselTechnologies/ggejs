const Crest = require("../structures/Crest");
const ConstantsColors = require("./ConstantsColors");

const NPC_SYMBOL = 100004;

module.exports.NPC_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = NPC_SYMBOL;
    crest.symbolColor1 = 0;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.THORN_KING_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();