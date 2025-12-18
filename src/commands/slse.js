const {parseLeaderboardSearchList} = require("../utils/LeaderboardParser");

const NAME = "slse"
/** @type {CommandCallback<LeaderboardSearchList>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const leaderboardSearchList = parseSLSE(client, params);
    require('.').baseExecuteCommand(client, leaderboardSearchList, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} listType
 * @param {string} searchValue
 * @param {number} leagueTypeId
 * @param {number} subdivisionId
 * @return {Promise<LeaderboardSearchList>}
 */
module.exports.searchLeaderboardScores = function (client, listType, searchValue, leagueTypeId, subdivisionId) {
    const C2SSearchLeaderboardScoresVO = {
        SV: searchValue,
        LT: listType,
        LID: leagueTypeId > 0 ? String(leagueTypeId) : "",
        SDI: subdivisionId
    };
    return require('.').baseSendCommand(client, NAME, C2SSearchLeaderboardScoresVO, callbacks, (p) => p?.["LT"] === listType);
}

module.exports.slse = parseSLSE;

/**
 * @param {BaseClient} client
 * @param {{LT:number, L: Array<{LID: number, L: string[]}>}} params
 * @return {LeaderboardSearchList}
 */
function parseSLSE(client, params) {
    if (!params) return null;
    return parseLeaderboardSearchList(params);
}