module.exports.name = "slse";
/**
 * @param {Socket} socket
 * @param {number} listType
 * @param {string} searchValue
 */
module.exports.execute = function (socket, listType, searchValue) {
    const C2SSearchLeaderboardScoresVO = {SV: searchValue, LT: 53};
    socket.client.socketManager.sendCommand("slse", C2SSearchLeaderboardScoresVO);
}