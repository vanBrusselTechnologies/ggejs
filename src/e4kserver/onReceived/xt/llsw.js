const {parseLeaderboardList} = require("../../../utils/LeaderboardParser");
module.exports.name = "llsw";

/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{LT:number, SI?: string, L: Array<{R: number, S: number, P: string, A: string, I: number, SI: string}>, T:number, LID:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const leaderboard = parseLeaderboardList(params);
    socket[`llsw_${leaderboard.listType}_${leaderboard.leagueType}_${leaderboard.scoreId}`] = leaderboard;
}