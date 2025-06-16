module.exports.name = "slse";
/**
 * @param {Client} client
 * @param {number} listType
 * @param {string} searchValue
 */
module.exports.execute = function (client, listType, searchValue) {
    const C2SSearchLeaderboardScoresVO = {SV: searchValue, LT: 53};
    client.socketManager.sendCommand("slse", C2SSearchLeaderboardScoresVO);
}