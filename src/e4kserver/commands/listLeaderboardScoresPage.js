module.exports.name = "llsp";
/**
 * @param {Socket} socket
 * @param {number} listType
 * @param {number} searchRank
 * @param {number} maxResults
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 */
module.exports.execute = function (socket, listType, searchRank, maxResults, leagueTypeId) {
    const C2SListLeaderboardScoresPageVO = {
        getCmdId: "llsp", params: {LT: listType, R: searchRank, M: maxResults, LID: leagueTypeId}
    };
    require('../data').sendCommandVO(socket, C2SListLeaderboardScoresPageVO);
}