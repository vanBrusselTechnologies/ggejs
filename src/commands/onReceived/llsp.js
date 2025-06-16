const {parseLeaderboardList} = require("../../utils/LeaderboardParser");
module.exports.name = "llsp";

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{LT:number, SI?: string, L: Array<{R: number, S: number, P: string, A: string, I: number, SI: string}>, T:number, LID:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const leaderboard = parseLeaderboardList(params)
    client._socket[`llsp_${leaderboard.listType}_${leaderboard.leagueType}_${leaderboard.items[0].rank}`] = leaderboard;
}