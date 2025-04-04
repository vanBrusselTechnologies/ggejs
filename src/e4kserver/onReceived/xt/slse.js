const {parseLeaderboardSearchList} = require("../../../utils/LeaderboardParser");
module.exports.name = "slse";

/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{LT:number, L: Array<{LID: number, L: string[]}>, LID:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const leaderboard = parseLeaderboardSearchList(params)
    socket[`slse_${leaderboard.listType}`] = leaderboard;
}