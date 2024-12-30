const WorldmapOwnerInfo = require("../../../structures/WorldmapOwnerInfo");

module.exports.name = "hgh";

/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{LT:number, LID: number, L: Array<Array>, LR:number, SV:string, FR: number, IGH: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params || !params.LID) return;
    const listType = params.LT
    const leaderboard = params.L;
    const highScoreItems = []
    if (Array.isArray(leaderboard)) {
        for (const item of leaderboard) {
            const highScoreItem = getHighScoreItem(socket.client, listType, item)
            if (highScoreItem) highScoreItems.push(highScoreItem);
        }
    }
    const output = {
        listType: listType,
        leagueId: params.LID,
        lastRow: params.LR,
        searchValue: params.SV,
        foundRank: params.FR,
        items: highScoreItems
    }
    const SV = output.searchValue.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    socket[`hgh_${output.listType}_${SV}`] = output;
}

/**
 * @param {Client} client
 * @param {number} listType
 * @param {Array} itemData
 */
function getHighScoreItem(client, listType, itemData) {
    if (listType !== 53 && !itemData[2]) return null;
    /** @type {AllianceHighScoreItem | PlayerHighScoreItem} */
    const highScoreItem = {}
    switch (listType) {
        case 10:
        case 12:
        case 11:
        case 47:
        case 45:
        case 501:
        case 59:
        case 52:
        case 21:
        case 69:
        case 70:
        case 74:
        case 77:
            // TODO: AllianceHighscoreItemServerInfoVO
            highScoreItem["alliance"] = parseAlliance(itemData[2]);
            highScoreItem["rank"] = itemData[0];
            highScoreItem["points"] = itemData[1];
            break;
        case 13:
            // TODO: AllianceHighscoreItemServerInfoVO
            highScoreItem["alliance"] = parseAlliance(itemData[3]);
            highScoreItem["isKingAlliance"] = itemData[0];
            highScoreItem["rank"] = itemData[1];
            highScoreItem["points"] = itemData[2];
            break;
        case 20:
            // TODO: SPTournamentHighscoreItemServerInfoVO
            highScoreItem["playerName"] = itemData[3];
            highScoreItem["playerId"] = itemData[2];
            highScoreItem["rank"] = itemData[0];
            highScoreItem["points"] = itemData[1];
            break;
        case 53:
            // TODO: PlayerHighscoreItemServerInfoVO
            highScoreItem["player"] = new WorldmapOwnerInfo(client).fillFromParamObject(itemData[1]);
            highScoreItem["rank"] = itemData[0];
            break;
        case 63:
        case 64:
            // TODO: SeasonLeagueHighscoreItemServerInfoVO
            highScoreItem["player"] = new WorldmapOwnerInfo(client).fillFromParamObject(itemData[2]);
            highScoreItem["rank"] = itemData[0];
            highScoreItem["points"] = itemData[1];
            highScoreItem["playerName"] = itemData[3];
            highScoreItem["seasonRankId"] = itemData[2]["KLRID"];
            highScoreItem["seasonMedalsData"] = itemData[2]["KLMO"];
            break;
        case 67:
        case 68:
            // TODO: SeasonLeagueAllianceHighscoreItemServerInfoVO
            highScoreItem["alliance"] = parseAlliance(itemData[2]);
            highScoreItem["rank"] = itemData[0];
            highScoreItem["points"] = itemData[1];
            highScoreItem["seasonRankId"] = highScoreItem.rank;
            highScoreItem["seasonMedalsData"] = itemData[3]["KLMO"];
            highScoreItem["amountVisible"] = listType !== 67;
            break;
        case 73:
            // TODO: PlayerHighscoreItemServerInfoVO
            highScoreItem["player"] = new WorldmapOwnerInfo(client).fillFromParamObject(itemData[2]);
            highScoreItem["rank"] = itemData[4];
            highScoreItem["points"] = itemData[1];
            highScoreItem["playerName"] = itemData[3];
            highScoreItem["rawValues"] = itemData;
            break;
        default:
            // TODO: PlayerHighscoreItemServerInfoVO
            highScoreItem["player"] = new WorldmapOwnerInfo(client).fillFromParamObject(itemData[2]);
            highScoreItem["rank"] = itemData[0];
            highScoreItem["points"] = itemData[1];
            highScoreItem["playerName"] = itemData[3];
            highScoreItem["rawValues"] = itemData;
    }
    highScoreItem["highscoreTypeId"] = listType;
    return highScoreItem;
}

/**
 * @param {[number, string, number, number]} params
 * @return {{allianceId: number, allianceName: string, memberAmount: number, allianceCurrentFame: number}}
 */
function parseAlliance(params) {
    return {
        allianceId: params.shift(),
        allianceName: params.shift(),
        memberAmount: params.shift(),
        allianceCurrentFame: params.shift()
    };
}