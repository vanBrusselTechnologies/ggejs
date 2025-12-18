const {parseLeaderboardList} = require("../utils/LeaderboardParser");

const NAME = "llsp";
/** @type {CommandCallback<LeaderboardList>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const leaderboardList = parseLLSP(client, params);
    require('.').baseExecuteCommand(client, leaderboardList, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} listType
 * @param {number} searchRank
 * @param {number} maxResults
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 * @param {number} subdivisionId
 * @return {Promise<LeaderboardList>}
 */
module.exports.listLeaderboardScoresPage = function (client, listType, searchRank, maxResults, leagueTypeId, subdivisionId) {
    const C2SListLeaderboardScoresPageVO = {
        LT: listType,
        R: searchRank,
        M: maxResults,
        LID: leagueTypeId > 0 ? String(leagueTypeId) : "",
        SDI: subdivisionId
    };
    return require('.').baseSendCommand(client, NAME, C2SListLeaderboardScoresPageVO, callbacks, (p) => p?.["LT"] === listType && p?.["LID"] === leagueTypeId && p?.["L"]?.[0]?.["R"] === searchRank);
}

module.exports.llsp = parseLLSP;

/**
 * @param {BaseClient} client
 * @param {{LT:number, SI?: string, L: Array<{R: number, S: number, P: string, A: string, I: number, SI: string}>, T:number, LID:number}} params
 * @return {LeaderboardList}
 */
function parseLLSP(client, params) {
    if (!params) return null;
    return parseLeaderboardList(params);
}