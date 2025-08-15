const WorldMapOwnerInfo = require("../structures/WorldMapOwnerInfo");

const NAME = "hgh";
/** @type {CommandCallback<HighScore<AllianceHighScoreItem | PlayerHighScoreItem>>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const highScore = parseHGH(client, params);
    require('.').baseExecuteCommand(client, highScore, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {string} searchValue
 * @param {number} listType
 * @param {number} leagueTypeId Bracket based on level, starting with 1
 * @return {Promise<HighScore<AllianceHighScoreItem | PlayerHighScoreItem>>}
 */
module.exports.getHighScore = function (client, searchValue = "1", listType = 6, leagueTypeId = 1) {
    const C2SGetHighScoreVO = {SV: searchValue, LT: listType, LID: leagueTypeId};
    return require('.').baseSendCommand(client, NAME, C2SGetHighScoreVO, callbacks, (p) => p?.["LT"] === listType && normalize(p?.["SV"]) === normalize(searchValue));
}

module.exports.hgh = parseHGH;

/**
 * @param {BaseClient} client
 * @param {{LT:number, LID: number, L: Array<Array>, LR:number, SV:string, FR: number, IGH: number}} params
 * @return {HighScore<AllianceHighScoreItem | PlayerHighScoreItem>}
 */
function parseHGH(client, params) {
    if (!params || !params.LID) return null;
    const listType = params.LT;
    const leaderboard = params.L;
    const highScoreItems = [];
    if (Array.isArray(leaderboard)) {
        for (const item of leaderboard) {
            const highScoreItem = getHighScoreItem(client, listType, item);
            if (highScoreItem) highScoreItems.push(highScoreItem);
        }
    }
    return {
        listType: listType,
        leagueId: params.LID,
        lastRow: params.LR,
        searchValue: params.SV,
        foundRank: params.FR,
        items: highScoreItems
    };
}

/**
 * @param {BaseClient} client
 * @param {number} listType
 * @param {Array} itemData
 */
function getHighScoreItem(client, listType, itemData) {
    if (listType !== 53 && !itemData[2]) return null;
    /** @type {AllianceHighScoreItem | PlayerHighScoreItem} */
    const highScoreItem = {};
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
        case 79:
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
            highScoreItem["player"] = new WorldMapOwnerInfo(client).fillFromParamObject(itemData[1]);
            highScoreItem["rank"] = itemData[0];
            break;
        case 63:
        case 64:
            // TODO: SeasonLeagueHighscoreItemServerInfoVO
            highScoreItem["player"] = new WorldMapOwnerInfo(client).fillFromParamObject(itemData[2]);
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
        default:
            // TODO: PlayerHighscoreItemServerInfoVO
            highScoreItem["player"] = new WorldMapOwnerInfo(client).fillFromParamObject(itemData[2]);
            highScoreItem["rank"] = itemData[0];
            highScoreItem["points"] = itemData[1];
            highScoreItem["playerName"] = itemData[3] ?? highScoreItem["player"].playerName;
            highScoreItem["rawValues"] = itemData;
    }
    highScoreItem["highScoreTypeId"] = listType;
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

/** @param {string} name */
normalize = (name) => typeof name !== "string" ? "" : name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");