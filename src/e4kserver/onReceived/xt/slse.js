const {parseLeaderboardSearchList} = require("../../../utils/LeaderboardParser");

module.exports.name = "slse";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{LT:number, L: Array<{LID: number, L: string[]}>, LID:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const leaderboard = parseLeaderboardSearchList(params)
    client._socket[`slse_${leaderboard.listType}`] = leaderboard;
}