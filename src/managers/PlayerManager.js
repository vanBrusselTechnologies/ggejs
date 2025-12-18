'use strict'

const BaseManager = require('./BaseManager');
const {getDetailPlayerInfo} = require('../commands/gdi');
const {getHighScore} = require("../commands/hgh");
const {listLeaderboardScoresPage} = require('../commands/llsp');
const {listLeaderboardScoresWindow} = require('../commands/llsw');
const {searchLeaderboardScores} = require('../commands/slse');
const {searchPlayer} = require('../commands/wsp');
const EmpireError = require("../tools/EmpireError");
const HighScoreConst = require("../utils/HighScoreConst");

class PlayerManager extends BaseManager {
    /** @param {number} id */
    async getById(id) {
        try {
            return await getDetailPlayerInfo(this._client, id);
        } catch (errorCode) {
            const overrideTextId = errorCode === 21 ? 'player_not_found' : '';
            throw new EmpireError(this._client, errorCode, overrideTextId);
        }
    }

    /**
     * @param {string} name
     * @returns {Promise<Player>}
     */
    async find(name) {
        const normalizedName = normalizeNameLowerCase(name);
        try {
            /** @type {number} */
            let playerId;
            try {
                // Try to find the user by rankings, on fail, use world map find
                const hghData = await this.getRankings(name, 'might', 6);
                playerId = hghData.items.find(item => normalizeNameLowerCase(item.playerName) === normalizedName).playerId;
            } catch (e) {
                const ownerInfo = await searchPlayer(this._client, name.toString());
                playerId = ownerInfo.playerId;
            }
            return await this.getById(playerId);
        } catch (errorCode) {
            const overrideTextId = (() => {
                switch (errorCode) {
                    case 21:
                        return 'player_not_found';
                    case 28:
                        return 'generic_register_namenotvalid';
                    case 96:
                        return 'player_not_on_map';
                    default:
                        return '';
                }
            })();
            throw new EmpireError(this._client, errorCode, overrideTextId);
        }
    }

    async getThisPlayer() {
        if (this._client.clientUserData.playerId === -1) return null;
        return await this.getById(this._client.clientUserData.playerId);
    }

    /**
     * @param {string | number} nameOrRanking
     * @param {PlayerHighScoreRankingTypes} rankingType
     * @param {number} leagueId Bracket based on level, starting with 1. Must be given when ranking (number) is used, can be omitted when using name (string)
     */
    async getRankings(nameOrRanking, rankingType = "might", leagueId = 1) {
        let isGlobalRanking = false;
        const listType = (() => {
            switch (rankingType) {
                case "achievementPoints":
                    return HighScoreConst.PLAYER_ACHIEVEMENT_POINTS;
                case "loot":
                    return HighScoreConst.PLAYER_WEEKLY_LOOT;
                case "honor":
                    return HighScoreConst.PLAYER_HONOR;
                case "might":
                    return HighScoreConst.PLAYER_MIGHT_POINTS;
                case "legendLevel":
                    return HighScoreConst.PLAYER_LEGEND;
                case "factionTournament":
                    return HighScoreConst.FACTION_TOURNAMENT;
                case "pointEvent":
                    return HighScoreConst.POINT_EVENT;
                case "luckyWheel":
                    return HighScoreConst.LUCKY_WHEEL;
                case "alienInvasion":
                    return HighScoreConst.ALLIANCE_ALIEN_INVASION_PLAYER;
                case "nomadInvasion":
                    return HighScoreConst.ALLIANCE_NOMADINVASION_PLAYER;
                case "colossus":
                    return HighScoreConst.COLOSSUS;
                case "samuraiInvasion":
                    return HighScoreConst.SAMURAI_PLAYER;
                case "longTermPointEvent":
                    isGlobalRanking = true;
                    return HighScoreConst.LONG_TERM_POINT_EVENT;
                case "redAlienInvasion":
                    return HighScoreConst.ALLIANCE_RED_ALIEN_INVASION_PLAYER;
                case "tempServerDailyMight":
                    return HighScoreConst.TEMP_SERVER_DAILY_MIGHT_POINTS_BUILDINGS;
                case "tempServerGlobal":
                    return HighScoreConst.TEMP_SERVER_GLOBAL;
                case "kingdomsLeagueSeason":
                    return HighScoreConst.KINGDOMS_LEAGUE_SEASON;
                case "kingdomsLeagueSeasonEvent":
                    return HighScoreConst.KINGDOMS_LEAGUE_SEASON_EVENT;
                case "tempServerDailyCollector":
                    return HighScoreConst.TEMP_SERVER_DAILY_COLLECTOR_POINTS;
                case "tempServerDailyRankSwap":
                    return HighScoreConst.TEMP_SERVER_DAILY_RANK_SWAP;
                case "allianceBattleGroundCollector":
                    return HighScoreConst.ALLIANCE_BATTLE_GROUND_PLAYER_COLLECTOR;
                case "SaleDaysLuckyWheel":
                    return HighScoreConst.LUCKY_WHEEL_SALE_DAYS;
                case "allianceBattleGroundTower":
                    return HighScoreConst.ALLIANCE_BATTLE_GROUND_PLAYER_TOWER;
                case "tempServerPreviousRun":
                    return HighScoreConst.TEMPSERVER_PREVIOUS_RUN_PLAYER;
                case "allianceBattleGroundPreviousRun":
                    return HighScoreConst.ALLIANCE_BATTLE_GROUND_PREVIOUS_RUN_PLAYER;
                case "donationEvent":
                    isGlobalRanking = true;
                    return HighScoreConst.DONATION_EVENT;
                case "decoGachaEvent":
                    return HighScoreConst.DECO_GACHA_EVENT;
                case "christmasGachaEvent":
                    return HighScoreConst.CHRISTMAS_GACHA_EVENT;
                case "easterGachaEvent":
                    return HighScoreConst.EASTER_GACHA_EVENT;
                case "summerGachaEvent":
                    return HighScoreConst.SUMMER_GACHA_EVENT;
                default:
                    return rankingType;
            }
        })();
        if (listType === -1) throw new EmpireError(this._client, "Rankings' list type not supported");
        if (!isGlobalRanking) {
            try {
                const searchValue = nameOrRanking.toString();
                /** @type {HighScore<PlayerHighScoreItem>} */
                const highScore = await getHighScore(this._client, searchValue, listType, leagueId);
                return convertHghLeaderboard(this._client, highScore);
            } catch (errorCode) {
                throw new EmpireError(this._client, errorCode);
            }
        }
        try {
            const maxResults = 10;
            switch (typeof nameOrRanking) {
                case "number":
                    const searchRank = Math.round(Math.max(1, nameOrRanking - maxResults / 2));
                    const leaderboardRankData = await listLeaderboardScoresPage(this._client, listType, searchRank, maxResults, leagueId, -1);
                    return convertListToLeaderboard(this._client, leaderboardRankData);
                case "string":
                    const leaderboardSearchData = await searchLeaderboardScores(this._client, listType, nameOrRanking, -1, -1);
                    const {scoreId, leagueType} = leaderboardSearchData.items[0];
                    const leaderboardWindowData = await listLeaderboardScoresWindow(this._client, listType, scoreId, maxResults, leagueType, -1);
                    return convertListToLeaderboard(this._client, leaderboardWindowData);
            }
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    }
}

/**
 * @param {BaseClient} client
 * @param {HighScore<PlayerHighScoreItem>} highScore
 * @returns {PlayerLeaderboard}
 */
function convertHghLeaderboard(client, highScore) {
    return {
        listType: highScore.listType,
        numScores: highScore.lastRow,
        leagueType: highScore.leagueId,
        items: highScore.items.map(i => {
            return {
                player: i.player,
                playerName: i.playerName ?? i.player.playerName,
                allianceName: undefined,
                instanceId: client.socketManager.serverInstance.value,
                points: i.points,
                rank: i.rank,
                playerId: i.playerId ?? i.player.playerId,
                seasonRankId: i.seasonRankId,
                seasonMedalsData: i.seasonMedalsData,
            }
        })
    }
}

/**
 * @param {BaseClient} client
 * @param {LeaderboardList} leaderBoardList
 * @returns {PlayerLeaderboard}
 */
function convertListToLeaderboard(client, leaderBoardList) {
    return {
        listType: leaderBoardList.listType,
        numScores: leaderBoardList.numScores,
        leagueType: leaderBoardList.leagueType,
        items: leaderBoardList.items.map(i => {
            return {
                playerName: i.playerName,
                allianceName: i.allianceName,
                instanceId: i.instanceId,
                points: i.points,
                rank: i.rank,
                playerId: i.playerId,
                seasonRankId: undefined,
                seasonMedalsData: undefined,
            }
        })
    }
}

/** @param {string} name */
const normalizeNameLowerCase = (name) => name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

module.exports = PlayerManager