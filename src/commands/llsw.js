const {parseLeaderboardList} = require("../utils/LeaderboardParser");

const NAME = "llsw";
/** @type {CommandCallback<LeaderboardList>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const leaderboardList = parseLLSW(client, params);
    require('.').baseExecuteCommand(leaderboardList, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} listType
 * @param {string} scoreId format: `gameId-networkId-serverInstanceId-playerId`
 * @param {number} maxResults
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 * @return {Promise<LeaderboardList>}
 */
module.exports.listLeaderboardScoresWindow = function (client, listType, scoreId, maxResults, leagueTypeId) {
    const C2SListLeaderboardScoresWindowVO = {LT: listType, SI: scoreId, M: maxResults, LID: leagueTypeId};
    return require('.').baseSendCommand(client, NAME, C2SListLeaderboardScoresWindowVO, callbacks, (p) => p?.["LT"] === listType && p?.["LID"] === leagueTypeId && p?.["SI"] === scoreId);
}

module.exports.llsw = parseLLSW;

/**
 * @param {Client} client
 * @param {{LT:number, SI?: string, L: Array<{R: number, S: number, P: string, A: string, I: number, SI: string}>, T:number, LID:number}} params
 * @return {LeaderboardList}
 */
function parseLLSW(client, params) {
    if (!params) return null;
    return parseLeaderboardList(params);
}