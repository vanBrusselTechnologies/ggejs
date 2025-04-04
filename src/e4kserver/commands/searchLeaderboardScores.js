module.exports.name = "slse";
/**
 * @param {Socket} socket
 * @param {number} listType
 * @param {string} searchValue
 */
module.exports.execute = function (socket, listType, searchValue) {
    const C2SSearchLeaderboardScoresVO = {getCmdId: "slse", params: {SV: searchValue, LT: 53}};
    require('../data').sendCommandVO(socket, C2SSearchLeaderboardScoresVO);
}