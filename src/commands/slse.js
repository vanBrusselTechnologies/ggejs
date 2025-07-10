const {parseLeaderboardSearchList} = require("../utils/LeaderboardParser");

const NAME = "slse"
/** @type {CommandCallback<LeaderboardSearchList>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const leaderboardSearchList = parseSLSE(client, params);
    require('.').baseExecuteCommand(leaderboardSearchList, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} listType
 * @param {string} searchValue
 * @return {Promise<LeaderboardSearchList>}
 */
module.exports.searchLeaderboardScores = function (client, listType, searchValue) {
    const C2SSearchLeaderboardScoresVO = {SV: searchValue, LT: 53};
    return require('.').baseSendCommand(client, NAME, C2SSearchLeaderboardScoresVO, callbacks, (p) => p["LT"] === listType);
}

module.exports.slse = parseSLSE;

/**
 * @param {Client} client
 * @param {{LT:number, L: Array<{LID: number, L: string[]}>}} params
 * @return {LeaderboardSearchList}
 */
function parseSLSE(client, params) {
    if (!params) return null;
    return parseLeaderboardSearchList(params);
}