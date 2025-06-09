const {TitleType} = require("../../../utils/Constants");
const {titles} = require('e4k-data').data;

module.exports.name = "uar";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    //todo: uar, gml, gcl, kgv, gkl, opt, and vip not fully correctly working

    const cud = socket.client.clientUserData;
    //cud.setTitleRatingStatus(createTitleRatingStatus(params.FTM), TitleType.FAME)
    //cud.setTitleRatingStatus(createTitleRatingStatus(params.BTM), TitleType.FACTION)
    cud.titlePrefix = TitleType[params["PFX"]] ?? TitleType.UNKNOWN;
    cud.titleSuffix = TitleType[params["SFX"]] ?? TitleType.UNKNOWN;
    //updateThresholdsFor(TitleType.FAME);
    //updateThresholdsFor(TitleType.FACTION);
    saveIsleTitle(cud, params["ITM"]["TID"]);
}

/* *
 * @param {number} titleType
 * /
function updateThresholdsFor(titleType) {
    var _loc5_: TitleVO = null;
    var _loc3_: int = 0;
    var _loc4_: Number = NaN;
    var _loc2_: int = 0;
    var _loc6_: Dictionary = titlesStaticData.mapTopPositionToTitleId[titleType];
    var _loc7_: Array = titlesStaticData.topTitlesPositionsInRating[titleType];
    var _loc8_: TitleRatingStatus;
    var _loc9_:number[] = (_loc8_ = titlesData.getRatingStatusFor(titleType)).thresholdsForTopX;
    _loc3_ = 0;
    while (_loc3_ < _loc7_.length) {
        _loc4_ = _loc9_[_loc3_];
        _loc2_ = int(_loc6_[_loc7_[_loc3_]]);
        (_loc5_ = titlesStaticData.getTitleById(_loc2_)).threshold = _loc4_;
        _loc3_++;
    }
}*/

/**
 * @param {ClientUserDataManager} cud
 * @param {number} titleId
 */
function saveIsleTitle(cud, titleId) {
    if (titleId >= 0) {
        const title = titles.find(t => t.titleID === titleId)
        cud.setCurrentTitle(TitleType.ISLE, title)
    } else {
        cud.clearCurrentTitle(TitleType.ISLE)
    }
}

/*function createTitleRatingStatus(data:Object) : TitleRatingStatus
{
    var _loc2_:TitleRatingStatus = new TitleRatingStatus();
    _loc2_.ggs_e4k_titles_internal::setRemainingSeconds(TimeConverter.convertServerTimestampToClientTimestamp(data.RS));
    _loc2_.ggs_e4k_titles_internal::setTopOneId(data.TOID);
    _loc2_.ggs_e4k_titles_internal::setCurrentTopX(data.CTXT);
    _loc2_.ggs_e4k_titles_internal::setThresholdsForTopX(data.NTFP);
    return _loc2_;
}*/