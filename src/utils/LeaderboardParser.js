/**
 * @param {{LT:number, SI?: string, L: Array<{R: number, S: number, P: string, A: string, I: number, SI: string}>, T:number, LID:number}} params
 * @returns {LeaderboardList}
 */
module.exports.parseLeaderboardList = function (params) {
    const listType = params.LT;
    return {
        listType: listType,
        scoreId: params.SI,
        numScores: params.T,
        leagueType: params.LID,
        items: params.L.map(item => parseLeaderboardItem(listType, item))
    };
}

/**
 * @param {number} listType
 * @param {{R: number, S: number, P: string, A: string, I: number, SI: string}} itemData
 * @return {LeaderboardListItem}
 */
function parseLeaderboardItem(listType, itemData) {
    const scoreId = itemData.SI;
    const scoreIdParts = scoreId.split('-');
    return {
        listType: listType,
        rank: itemData.R,
        points: itemData.S,
        playerName: itemData.P,
        allianceName: itemData.A,
        instanceId: itemData.I,
        scoreId: scoreId,
        // TODO metadata
        // metadataVO: parseItemMetadata(itemData)
        playerId: parseInt(scoreIdParts[3])
    };
}
/*  TODO LeaderboardScoreMetadataVO
    function parseItemMetadata(paramsObj) : LeaderboardScoreMetadataVO
    {
        var _loc2_:LeaderboardScoreMetadataVO = new LeaderboardScoreMetadataVO();
        _loc2_.allianceCrestLayoutVO = allianceCrestInfoParser.parseSingleCrestLayout(paramsObj["SM"]);
        return _loc2_;
    }
 */

/**
 * @param {{LT:number, L: Array<{LID: number, L: []}>}} params
 * @returns {LeaderboardSearchList}
 */
module.exports.parseLeaderboardSearchList = function (params) {
    return {listType: params.LT, items: parseLeaderboardSearchListItems(params.L)};
}

/** @param {{LID: number, L: string[]}[]} items */
function parseLeaderboardSearchListItems(items) {
    /** @type {LeaderboardSearchListItem[]} */
    const listItems = [];
    for (const item of items) {
        const leagueType = item.LID;
        for (const scoreId of item.L) listItems.push({scoreId, leagueType});
    }
    return listItems;
}