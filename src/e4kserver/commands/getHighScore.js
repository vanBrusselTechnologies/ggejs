module.exports.name = "hgh";
/**
 * @param {Socket} socket
 * @param {string} searchValue
 * @param {number} listType
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 */
module.exports.execute = function (socket, searchValue = "1", listType = 6, leagueTypeId = 1) {
    const C2SGetHighscoreVO = {getCmdId: "hgh", params: {SV: searchValue, LT: listType, LID: leagueTypeId}}
    require('../data').sendCommandVO(socket, C2SGetHighscoreVO);
}