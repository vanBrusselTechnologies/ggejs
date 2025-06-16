module.exports.name = "llsp";
/**
 * @param {Client} client
 * @param {number} listType
 * @param {number} searchRank
 * @param {number} maxResults
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 */
module.exports.execute = function (client, listType, searchRank, maxResults, leagueTypeId) {
    const C2SListLeaderboardScoresPageVO = {LT: listType, R: searchRank, M: maxResults, LID: leagueTypeId};
    client.socketManager.sendCommand("llsp", C2SListLeaderboardScoresPageVO);
}