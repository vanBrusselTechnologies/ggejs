module.exports.name = "hgh";
/**
 * @param {Socket} socket
 * @param {string} searchValue
 * @param {string} rankingType
 * @param {number} listId
 */
module.exports.execute = function (socket, searchValue = "1", rankingType = "might", listId = 1) {
    let listType = 11;
    switch (rankingType) {
        case "honor":
            listType = 10;
            break;
        case "might":
            listType = 11;
            break;
        case "landMarks":
            listType = 12;
            break;
        case "aqua":
            listType = 13;
            break;
        case "tournamentFame":
            listType = 21;
            break;
        case "alienInvasion":
            listType = 45;
            break;
        case "nomadInvasion":
            listType = 47;
            break;
        case "samuraiInvasion":
            listType = 52;
            break;
        //case "factionInvasion":
        //    listType = 56;
        //    break;
        case "redAlienInvasion":
            listType = 59;
            break;
        case "kingdomsLeagueSeason":
            listType = 67;
            break;
        case "kingdomsLeagueSeasonEvent":
            listType = 68;
            break;
        case "daimyo":
            listType = 69;
            break;
        case "allianceBattleGroundCollector":
            listType = 70;
            break;
        case "allianceBattleGroundTower":
            listType = 74;
            break;
        case "allianceBattleGroundPreviousRun":
            listType = 77;
            break;
        case "samuraiAlienInvasion":
            listType = 501;
            break;
        default:
            break;
    }
    const C2SGetHighscoreVO = {
        getCmdId: "hgh", params: {SV: searchValue, LT: listType, LID: listId}
    }
    require('../data').sendCommandVO(socket, C2SGetHighscoreVO);
}