module.exports.name = "llsw";
/**
 * @param {Socket} socket
 * @param {number} listType
 * @param {string} scoreId format: `gameId-networkId-serverInstanceId-playerId`
 * @param {number} maxResults
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 */
module.exports.execute = function (socket, listType, scoreId, maxResults, leagueTypeId) {
    const C2SListLeaderboardScoresWindowVO = {LT: listType, SI: scoreId, M: maxResults, LID: leagueTypeId};
    socket.client.socketManager.sendCommand("llsw", C2SListLeaderboardScoresWindowVO);
}