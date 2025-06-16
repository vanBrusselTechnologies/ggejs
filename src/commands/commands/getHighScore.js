module.exports.name = "hgh";
/**
 * @param {Client} client
 * @param {string} searchValue
 * @param {number} listType
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 */
module.exports.execute = function (client, searchValue = "1", listType = 6, leagueTypeId = 1) {
    const C2SGetHighscoreVO = {SV: searchValue, LT: listType, LID: leagueTypeId};
    client.socketManager.sendCommand("hgh", C2SGetHighscoreVO);
}