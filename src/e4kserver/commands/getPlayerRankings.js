module.exports.name = "hgh";
/**
 * @param {Socket} socket
 * @param {string} searchValue
 * @param {string} rankingType
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 */
module.exports.execute = function (socket, searchValue = "1", rankingType = "might", leagueTypeId = 1) {
    let listType = 2;
    switch (rankingType) {
        case "achievementPoints":
            listType = 1;
            break;
        case "loot":
            listType = 2;
            break;
        case "honor":
            listType = 5;
            break;
        case "might":
            listType = 6;
            break;
        case "legendLevel":
            listType = 7;
            break;
        case "factionTournament":
            listType = 56;
            break;
        case "pointEvent":
            listType = 40;
            break;
        case "beggingKnights":
            listType = 41;
            break;
        case "alienInvasion":
            listType = 42;
            break;
        case "luckyWheel":
            listType = 43;
            break;
        case "allianceAlienInvasion":
            listType = 44;
            break;
        case "allianceNomadInvasion":
            listType = 46;
            break;
        //case "nomadInvasion":
        //    listType = 48;
        //    break;
        case "colossus":
            listType = 50;
            break;
        case "samuraiInvasion":
            listType = 51;
            break;
        case "longTermPointEvent":
            listType = 53;
            break;
        //case "factionInvasionBlue":
        //    listType = 54;
        //    break;
        //case "factionInvasionRed":
        //    listType = 55;
        //    break;
        case "redAlienInvasion":
            listType = 58;
            break;
        case "shapeshifter":
            listType = 60;
            break;
        case "tempServerDailyMight":
            listType = 61;
            break;
        case "tempServerGlobal":
            listType = 62;
            break;
        case "kingdomsLeagueSeason":
            listType = 63;
            break;
        case "kingdomsLeagueSeasonEvent":
            listType = 64;
            break;
        case "tempServerDailyCollector":
            listType = 65;
            break;
        case "tempServerDailyRankSwap":
            listType = 66;
            break;
        case "allianceBattleGroundCollector":
            listType = 71;
            break;
        case "SaleDaysLuckyWheel":
            listType = 72;
            break;
        case "tempServerCharge":
            listType = 73;
            break;
        case "allianceBattleGroundTower":
            listType = 75;
            break;
        case "tempServerPreviousRun":
            listType = 78;
            break;
        case "allianceBattleGroundPreviousRun":
            listType = 78;
            break;
        case "samuraiAlienInvasion":
            listType = 500;
            break;
        default:
            listType = rankingType
            break;
    }
    let C2SGetHighscoreVO = {
        getCmdId: "hgh", params: {SV: searchValue, LT: listType, LID: leagueTypeId},
    }
    require('../data').sendCommandVO(socket, C2SGetHighscoreVO);
}