module.exports.name = "llsw";
/**
 * @param {Client} client
 * @param {number} listType
 * @param {string} scoreId format: `gameId-networkId-serverInstanceId-playerId`
 * @param {number} maxResults
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 */
module.exports.execute = function (client, listType, scoreId, maxResults, leagueTypeId) {
    const C2SListLeaderboardScoresWindowVO = {LT: listType, SI: scoreId, M: maxResults, LID: leagueTypeId};
    client.socketManager.sendCommand("llsw", C2SListLeaderboardScoresWindowVO);
}