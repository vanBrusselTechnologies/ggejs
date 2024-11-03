const Crest = require("../structures/Crest");
const ConstantsColors = require("./ConstantsColors");

module.exports.ROBBER_BARON_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 100008;
    crest.symbolColor1 = ConstantsColors.DUNGEON_SYMBOL;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.DUNGEON_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();

module.exports.SHADOW_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 100;
    crest.symbolColor1 = ConstantsColors.SHADOW_SYMBOL;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.SHADOW_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();

module.exports.CLASSIC_KINGDOM_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 35;
    crest.symbolColor1 = ConstantsColors.CLASSIC_KINGDOM_SYMBOL;
    crest.backgroundType = 2;
    crest.backgroundColor1 = ConstantsColors.CLASSIC_KINGDOM_BACKGROUND_1;
    crest.backgroundColor2 = ConstantsColors.CLASSIC_KINGDOM_BACKGROUND_2;
    crest.fillClipColor();
    return crest;
})();

module.exports.ICE_KINGDOM_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 100002;
    crest.symbolColor1 = ConstantsColors.ICE_KINGDOM_SYMBOL;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.ICE_KINGDOM_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();
module.exports.DESERT_KINGDOM_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 100001;
    crest.symbolColor1 = ConstantsColors.DESERT_KINGDOM_SYMBOL;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.DESERT_KINGDOM_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();
module.exports.VOLCANO_KINGDOM_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 100003;
    crest.symbolColor1 = ConstantsColors.VOLCANO_KINGDOM_SYMBOL;
    crest.backgroundType = 0;
    crest.backgroundColor1 = ConstantsColors.VOLCANO_KINGDOM_BACKGROUND;
    crest.fillClipColor();
    return crest;
})();
module.exports.UNKNOWN_CREST = (function () {
    const crest = new Crest(null, null);
    crest.symbolPosType = 1;
    crest.symbolType1 = 1000;
    crest.symbolColor1 = 16777215;
    crest.backgroundType = 0;
    crest.backgroundColor1 = 0;
    crest.fillClipColor();
    return crest;
})();

const KINGDOM_CRESTS = {
    0: module.exports.CLASSIC_KINGDOM_CREST,
    2: module.exports.ICE_KINGDOM_CREST,
    1: module.exports.DESERT_KINGDOM_CREST,
    3: module.exports.VOLCANO_KINGDOM_CREST
}

module.exports.SYMBOL_TYPE_ROBBER_BARON = 100008;
module.exports.SYMBOL_TYPE_KINGDOM_DEFAULT = 35;
module.exports.SYMBOL_TYPE_KINGDOM_ICE = 100002;
module.exports.SYMBOL_TYPE_KINGDOM_DESERT = 100001;
module.exports.SYMBOL_TYPE_KINGDOM_VOLCANO = 100003;
module.exports.SYMBOL_TYPE_SHADOW_CAMP = 100;
module.exports.SYMBOL_TYPE_UNKNOWN = 1000;
module.exports.BACKGROUND_TYPE_ONE_PLAIN = 0;
module.exports.BACKGROUND_TYPE_TWO_HORIZONTAL = 1;
module.exports.BACKGROUND_TYPE_TWO_VERTICAL = 2;
module.exports.BACKGROUND_TYPE_FOUR_X = 3;
module.exports.BACKGROUND_LAYOUTS = [0, 1, 2, 3];
module.exports.SYMBOL_POSITION_NONE = 0;
module.exports.SYMBOL_POSITION_ONE_CENTERED = 1;
module.exports.SYMBOL_POSITION_TWO_HORIZONTAL = 2;
module.exports.SYMBOL_POSITION_TWO_VERTICAL = 3;
module.exports.SYMBOL_POSITION_FOUR_X = 4;
module.exports.SYMBOL_LAYOUTS = [0, 1, 2, 3, 4];
module.exports.COLORS = [14408394, 8881264, 5197126, 1644825, 5319690, 8993831, 11993088, 14037522, 16341788, 14392335, 15708678, 15259663, 13550873, 30512, 39783, 305315, 4690653, 1009082, 4006527, 13509737];

/**@type {{SC1: number, SC2: number, SPT: number, BGC2: number, BGC1: number, BGT: number, S1: number, S2: number}[]} */
module.exports.RANDOM_CRESTS_STRINGS = [{
    "SPT": 4, "BGC2": 1644825, "BGC1": 13550873, "BGT": 3, "SC2": 15259663, "SC1": 1644825, "S2": 24, "S1": 5
}, {
    "SPT": 4, "BGC2": 11993088, "BGC1": 1644825, "BGT": 3, "SC2": 14408394, "SC1": 14408394, "S2": 9, "S1": 21
}, {
    "SPT": 4, "BGC2": 11993088, "BGC1": 39783, "BGT": 3, "SC2": 14408394, "SC1": 1644825, "S2": 29, "S1": 29
}, {
    "SPT": 1, "BGC2": 11993088, "BGC1": 39783, "BGT": 3, "SC2": 14408394, "SC1": 1644825, "S2": 29, "S1": 29
}, {
    "SPT": 4, "BGC2": 1644825, "BGC1": 14408394, "BGT": 3, "SC2": 14408394, "SC1": 1644825, "S2": 23, "S1": 5
}, {
    "SPT": 4, "BGC2": 1644825, "BGC1": 14408394, "BGT": 3, "SC2": 14408394, "SC1": 1644825, "S2": 6, "S1": 7
}, {
    "SPT": 4, "BGC2": 15708678, "BGC1": 8881264, "BGT": 3, "SC2": 8881264, "SC1": 15708678, "S2": 9, "S1": 3
}, {
    "SPT": 4, "BGC2": 14408394, "BGC1": 305315, "BGT": 3, "SC2": 15708678, "SC1": 15708678, "S2": 10, "S1": 11
}, {
    "SPT": 1, "BGC2": 1009082, "BGC1": 1644825, "BGT": 3, "SC2": 16341788, "SC1": 11993088, "S2": 15, "S1": 27
}, {
    "SPT": 4, "BGC2": 4690653, "BGC1": 30512, "BGT": 3, "SC2": 30512, "SC1": 4690653, "S2": 15, "S1": 27
}, {
    "SPT": 4, "BGC2": 11993088, "BGC1": 14392335, "BGT": 3, "SC2": 11993088, "SC1": 11993088, "S2": 18, "S1": 18
}, {
    "SPT": 1, "BGC2": 39783, "BGC1": 8993831, "BGT": 3, "SC2": 13509737, "SC1": 5319690, "S2": 27, "S1": 8
}, {
    "SPT": 2, "BGC2": 11993088, "BGC1": 15708678, "BGT": 3, "SC2": 15708678, "SC1": 11993088, "S2": 3, "S1": 3
}, {
    "SPT": 2, "BGC2": 15708678, "BGC1": 5319690, "BGT": 3, "SC2": 5319690, "SC1": 5319690, "S2": 9, "S1": 9
}, {
    "SPT": 4, "BGC2": 14408394, "BGC1": 11993088, "BGT": 3, "SC2": 11993088, "SC1": 11993088, "S2": 9, "S1": 9
}, {
    "SPT": 4, "BGC2": 14408394, "BGC1": 11993088, "BGT": 3, "SC2": 11993088, "SC1": 14408394, "S2": 27, "S1": 12
}, {
    "SPT": 4, "BGC2": 14408394, "BGC1": 1644825, "BGT": 3, "SC2": 1644825, "SC1": 14408394, "S2": 12, "S1": 12
}, {
    "SPT": 4, "BGC2": 1009082, "BGC1": 15708678, "BGT": 3, "SC2": 15708678, "SC1": 1009082, "S2": 12, "S1": 2
}, {
    "SPT": 4, "BGC2": 1009082, "BGC1": 16341788, "BGT": 3, "SC2": 16341788, "SC1": 1009082, "S2": 4, "S1": 36
}, {
    "SPT": 4, "BGC2": 5319690, "BGC1": 13550873, "BGT": 3, "SC2": 13550873, "SC1": 5319690, "S2": 34, "S1": 16
}, {
    "SPT": 4, "BGC2": 14408394, "BGC1": 39783, "BGT": 3, "SC2": 39783, "SC1": 14408394, "S2": 28, "S1": 14
}, {
    "SPT": 4, "BGC2": 4690653, "BGC1": 15708678, "BGT": 3, "SC2": 15708678, "SC1": 4690653, "S2": 22, "S1": 4
}, {
    "SPT": 1, "BGC2": 39783, "BGC1": 5197126, "BGT": 3, "SC2": 1644825, "SC1": 30512, "S2": 18, "S1": 3
}, {
    "SPT": 4, "BGC2": 1009082, "BGC1": 13550873, "BGT": 3, "SC2": 13550873, "SC1": 13550873, "S2": 12, "S1": 12
}, {
    "SPT": 1, "BGC2": 4690653, "BGC1": 14037522, "BGT": 3, "SC2": 16341788, "SC1": 15259663, "S2": 0, "S1": 30
}, {
    "SPT": 4, "BGC2": 14408394, "BGC1": 1644825, "BGT": 3, "SC2": 305315, "SC1": 4690653, "S2": 15, "S1": 15
}, {
    "SPT": 4, "BGC2": 11993088, "BGC1": 1009082, "BGT": 3, "SC2": 15708678, "SC1": 14408394, "S2": 31, "S1": 36
}, {
    "SPT": 1, "BGC2": 5197126, "BGC1": 1644825, "BGT": 3, "SC2": 15708678, "SC1": 39783, "S2": 5, "S1": 28
}, {
    "SPT": 1, "BGC2": 4006527, "BGC1": 14408394, "BGT": 3, "SC2": 15259663, "SC1": 15708678, "S2": 30, "S1": 28
}, {
    "SPT": 4, "BGC2": 11993088, "BGC1": 16341788, "BGT": 3, "SC2": 14037522, "SC1": 11993088, "S2": 12, "S1": 12
}, {
    "SPT": 1, "BGC2": 4006527, "BGC1": 1644825, "BGT": 3, "SC2": 8993831, "SC1": 14392335, "S2": 31, "S1": 31
}, {
    "SPT": 3, "BGC2": 14408394, "BGC1": 39783, "BGT": 2, "SC2": 39783, "SC1": 14408394, "S2": 18, "S1": 18
}, {
    "SPT": 1, "BGC2": 1009082, "BGC1": 15708678, "BGT": 2, "SC2": 39783, "SC1": 1644825, "S2": 18, "S1": 18
}, {
    "SPT": 3, "BGC2": 14037522, "BGC1": 14392335, "BGT": 2, "SC2": 14392335, "SC1": 14037522, "S2": 9, "S1": 9
}, {
    "SPT": 1, "BGC2": 14037522, "BGC1": 14392335, "BGT": 2, "SC2": 14392335, "SC1": 15708678, "S2": 9, "S1": 2
}, {
    "SPT": 1, "BGC2": 1644825, "BGC1": 14408394, "BGT": 2, "SC2": 14392335, "SC1": 8881264, "S2": 9, "S1": 5
}, {
    "SPT": 1, "BGC2": 4690653, "BGC1": 14037522, "BGT": 2, "SC2": 15259663, "SC1": 14408394, "S2": 36, "S1": 9
}, {
    "SPT": 3, "BGC2": 1009082, "BGC1": 14408394, "BGT": 2, "SC2": 14408394, "SC1": 1009082, "S2": 14, "S1": 3
}, {
    "SPT": 1, "BGC2": 1644825, "BGC1": 30512, "BGT": 2, "SC2": 13550873, "SC1": 30512, "S2": 1, "S1": 7
}, {
    "SPT": 1, "BGC2": 16341788, "BGC1": 5319690, "BGT": 1, "SC2": 30512, "SC1": 14037522, "S2": 14, "S1": 23
}, {
    "SPT": 2, "BGC2": 11993088, "BGC1": 5197126, "BGT": 1, "SC2": 14037522, "SC1": 8881264, "S2": 29, "S1": 30
}, {
    "SPT": 1, "BGC2": 5319690, "BGC1": 8881264, "BGT": 2, "SC2": 4690653, "SC1": 5197126, "S2": 16, "S1": 13
}, {
    "SPT": 1, "BGC2": 1644825, "BGC1": 5197126, "BGT": 2, "SC2": 4006527, "SC1": 15708678, "S2": 0, "S1": 9
}, {
    "SPT": 1, "BGC2": 4006527, "BGC1": 5197126, "BGT": 2, "SC2": 13509737, "SC1": 14392335, "S2": 35, "S1": 21
}, {
    "SPT": 4, "BGC2": 1644825, "BGC1": 39783, "BGT": 3, "SC2": 39783, "SC1": 1644825, "S2": 9, "S1": 3
}, {
    "SPT": 4, "BGC2": 39783, "BGC1": 14408394, "BGT": 3, "SC2": 14408394, "SC1": 39783, "S2": 25, "S1": 26
}, {
    "SPT": 4, "BGC2": 4006527, "BGC1": 16341788, "BGT": 3, "SC2": 16341788, "SC1": 4006527, "S2": 18, "S1": 15
}, {
    "SPT": 4, "BGC2": 30512, "BGC1": 14037522, "BGT": 3, "SC2": 14037522, "SC1": 30512, "S2": 32, "S1": 1
}, {
    "SPT": 2, "BGC2": 14392335, "BGC1": 11993088, "BGT": 1, "SC2": 11993088, "SC1": 15708678, "S2": 9, "S1": 18
}, {
    "SPT": 2, "BGC2": 1644825, "BGC1": 16341788, "BGT": 1, "SC2": 16341788, "SC1": 1644825, "S2": 3, "S1": 3
}, {
    "SPT": 2, "BGC2": 30512, "BGC1": 5319690, "BGT": 1, "SC2": 5319690, "SC1": 30512, "S2": 11, "S1": 10
}, {
    "SPT": 2, "BGC2": 1644825, "BGC1": 15708678, "BGT": 1, "SC2": 15708678, "SC1": 1644825, "S2": 16, "S1": 16
}, {
    "SPT": 2, "BGC2": 16341788, "BGC1": 39783, "BGT": 1, "SC2": 39783, "SC1": 16341788, "S2": 7, "S1": 6
}, {
    "SPT": 1, "BGC2": 14408394, "BGC1": 1644825, "BGT": 1, "SC2": 1009082, "SC1": 14392335, "S2": 32, "S1": 24
}, {
    "SPT": 1, "BGC2": 1009082, "BGC1": 4690653, "BGT": 1, "SC2": 16341788, "SC1": 14408394, "S2": 9, "S1": 28
}, {
    "SPT": 1, "BGC2": 305315, "BGC1": 14037522, "BGT": 1, "SC2": 13550873, "SC1": 5319690, "S2": 37, "S1": 12
}, {
    "SPT": 1, "BGC2": 4006527, "BGC1": 39783, "BGT": 1, "SC2": 4690653, "SC1": 30512, "S2": 34, "S1": 35
}, {
    "SPT": 1, "BGC2": 14408394, "BGC1": 14408394, "BGT": 0, "SC2": 14392335, "SC1": 1644825, "S2": 9, "S1": 5
}, {
    "SPT": 1, "BGC2": 14408394, "BGC1": 1644825, "BGT": 0, "SC2": 14392335, "SC1": 15708678, "S2": 9, "S1": 12
}, {
    "SPT": 1, "BGC2": 14408394, "BGC1": 4006527, "BGT": 0, "SC2": 14392335, "SC1": 14408394, "S2": 9, "S1": 2
}, {
    "SPT": 1, "BGC2": 14408394, "BGC1": 11993088, "BGT": 0, "SC2": 14392335, "SC1": 14408394, "S2": 9, "S1": 18
}, {
    "SPT": 1, "BGC2": 15708678, "BGC1": 15708678, "BGT": 0, "SC2": 15708678, "SC1": 1644825, "S2": 16, "S1": 16
}, {
    "SPT": 1, "BGC2": 13550873, "BGC1": 13550873, "BGT": 0, "SC2": 5319690, "SC1": 1009082, "S2": 26, "S1": 21
}, {
    "SPT": 1, "BGC2": 1644825, "BGC1": 1009082, "BGT": 0, "SC2": 13550873, "SC1": 14408394, "S2": 4, "S1": 1
}, {
    "SPT": 1, "BGC2": 4006527, "BGC1": 4006527, "BGT": 0, "SC2": 13550873, "SC1": 14408394, "S2": 28, "S1": 28
}, {
    "SPT": 4, "BGC2": 14037522, "BGC1": 5319690, "BGT": 3, "SC2": 5319690, "SC1": 14037522, "S2": 20, "S1": 5
}, {
    "SPT": 4, "BGC2": 39783, "BGC1": 15259663, "BGT": 3, "SC2": 15259663, "SC1": 39783, "S2": 18, "S1": 21
}, {
    "SPT": 3, "BGC2": 1644825, "BGC1": 1644825, "BGT": 0, "SC2": 1644825, "SC1": 15708678, "S2": 7, "S1": 18
}, {
    "SPT": 1, "BGC2": 30512, "BGC1": 39783, "BGT": 3, "SC2": 16341788, "SC1": 30512, "S2": 22, "S1": 24
}, {
    "SPT": 1, "BGC2": 15708678, "BGC1": 11993088, "BGT": 3, "SC2": 14408394, "SC1": 15259663, "S2": 7, "S1": 21
}, {
    "SPT": 1, "BGC2": 14408394, "BGC1": 11993088, "BGT": 3, "SC2": 1009082, "SC1": 1644825, "S2": 28, "S1": 21
}, {
    "SPT": 0, "BGC2": 5197126, "BGC1": 305315, "BGT": 3, "SC2": 8993831, "SC1": 1009082, "S2": 19, "S1": 14
}, {
    "SPT": 1, "BGC2": 8993831, "BGC1": 8993831, "BGT": 0, "SC2": 13509737, "SC1": 1644825, "S2": 25, "S1": 32
}, {
    "SPT": 1, "BGC2": 8993831, "BGC1": 8993831, "BGT": 0, "SC2": 13509737, "SC1": 1644825, "S2": 25, "S1": 32
}, {
    "SPT": 4, "BGC2": 14392335, "BGC1": 4006527, "BGT": 3, "SC2": 14408394, "SC1": 14408394, "S2": 2, "S1": 12
}, {
    "SPT": 1, "BGC2": 14408394, "BGC1": 1009082, "BGT": 3, "SC2": 8993831, "SC1": 305315, "S2": 30, "S1": 18
}, {
    "SPT": 1, "BGC2": 14392335, "BGC1": 1644825, "BGT": 3, "SC2": 15708678, "SC1": 5197126, "S2": 30, "S1": 30
}, {
    "SPT": 2, "BGC2": 15259663, "BGC1": 39783, "BGT": 1, "SC2": 39783, "SC1": 15259663, "S2": 10, "S1": 11
}, {
    "SPT": 4, "BGC2": 30512, "BGC1": 15259663, "BGT": 3, "SC2": 15259663, "SC1": 30512, "S2": 15, "S1": 3
}, {
    "SPT": 1, "BGC2": 14037522, "BGC1": 39783, "BGT": 1, "SC2": 305315, "SC1": 30512, "S2": 1, "S1": 12
}, {
    "SPT": 1, "BGC2": 13550873, "BGC1": 4006527, "BGT": 1, "SC2": 14408394, "SC1": 1009082, "S2": 35, "S1": 21
}, {
    "SPT": 4, "BGC2": 16341788, "BGC1": 1644825, "BGT": 3, "SC2": 8993831, "SC1": 16341788, "S2": 9, "S1": 16
}, {
    "SPT": 1, "BGC2": 1009082, "BGC1": 5197126, "BGT": 3, "SC2": 11993088, "SC1": 8881264, "S2": 36, "S1": 9
}, {
    "SPT": 4, "BGC2": 30512, "BGC1": 11993088, "BGT": 3, "SC2": 15259663, "SC1": 15259663, "S2": 37, "S1": 15
}, {
    "SPT": 1, "BGC2": 30512, "BGC1": 4006527, "BGT": 2, "SC2": 15259663, "SC1": 13550873, "S2": 24, "S1": 28
}, {
    "SPT": 1, "BGC2": 8881264, "BGC1": 4690653, "BGT": 2, "SC2": 11993088, "SC1": 5197126, "S2": 7, "S1": 3
}, {
    "SPT": 1, "BGC2": 16341788, "BGC1": 30512, "BGT": 2, "SC2": 13550873, "SC1": 15708678, "S2": 27, "S1": 11
}, {
    "SPT": 4, "BGC2": 13550873, "BGC1": 4006527, "BGT": 3, "SC2": 4006527, "SC1": 15259663, "S2": 27, "S1": 13
}, {
    "SPT": 1, "BGC2": 15708678, "BGC1": 39783, "BGT": 2, "SC2": 1009082, "SC1": 4006527, "S2": 15, "S1": 33
}, {
    "SPT": 4, "BGC2": 39783, "BGC1": 5319690, "BGT": 3, "SC2": 5197126, "SC1": 8993831, "S2": 27, "S1": 24
}, {
    "SPT": 4, "BGC2": 30512, "BGC1": 15708678, "BGT": 3, "SC2": 14392335, "SC1": 30512, "S2": 1, "S1": 4
}, {
    "SPT": 4, "BGC2": 4006527, "BGC1": 14037522, "BGT": 3, "SC2": 14037522, "SC1": 4006527, "S2": 12, "S1": 28
}, {
    "SPT": 4, "BGC2": 1644825, "BGC1": 5197126, "BGT": 3, "SC2": 14408394, "SC1": 14408394, "S2": 23, "S1": 30
}, {
    "SPT": 4, "BGC2": 16341788, "BGC1": 39783, "BGT": 3, "SC2": 15708678, "SC1": 13550873, "S2": 21, "S1": 22
}, {
    "SPT": 1, "BGC2": 14037522, "BGC1": 11993088, "BGT": 1, "SC2": 5197126, "SC1": 16341788, "S2": 35, "S1": 18
}];

/**
 * @param {number} kingdomId
 * @return {Crest}
 */
module.exports.getKingdomCrest = function (kingdomId) {
    return KINGDOM_CRESTS[kingdomId];
}