'use strict'

const BaseManager = require('./BaseManager');
const {execute: getDetailedPlayerInfo} = require('../e4kserver/commands/getDetailedPlayerInfo');
const {execute: searchPlayer} = require('../e4kserver/commands/searchPlayer');
const {WaitUntil} = require('../tools/wait');
const Localize = require("../tools/Localize");
const {execute: getHighScore} = require("../e4kserver/commands/getHighScore");
const HighScoreConst = require("../utils/HighScoreConst");
const {execute: listLeaderboardScoresPage} = require('../e4kserver/commands/listLeaderboardScoresPage');
const {execute: searchLeaderboardScores} = require('../e4kserver/commands/searchLeaderboardScores');
const {execute: listLeaderboardScoresWindow} = require('../e4kserver/commands/listLeaderboardScoresWindow');

class PlayerManager extends BaseManager {
    /** @param {number} id */
    async getById(id) {
        if (this._client._socket[`__requesting_players`] === undefined) this._client._socket[`__requesting_players`] = [];
        /** @type {Array} */
        const reqPlayers = this._client._socket[`__requesting_players`];
        try {
            if (!reqPlayers.includes(id)) getDetailedPlayerInfo(this._client, id);
            reqPlayers.push(id);
            /** @type {Player} */
            const player = await WaitUntil(this._client._socket, `__get_player_${id}`, "__get_player_error");
            reqPlayers.splice(reqPlayers.indexOf(id), 1);
            if (!reqPlayers.includes(id)) delete this._client._socket[`__get_player_${id}`];
            return player;
        } catch (e) {
            reqPlayers.splice(reqPlayers.indexOf(id), 1);
            delete this._client._socket["__get_player_error"];
            throw Localize.text(this._client, e);
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
                searchPlayer(this._client, name);
                playerId = await WaitUntil(this._client._socket, `__search_player_${normalizedName}`, "__search_player_error", 1000);
                delete this._client._socket[`__search_player_${normalizedName}`];
            }
            return await this.getById(playerId);
        } catch (e) {
            delete this._client._socket[`__search_player_${normalizedName}`];
            delete this._client._socket["__search_player_error"];
            throw Localize.text(this._client, e);
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
                    return -1;
            }
        })();
        if (listType === -1) throw "Rankings' list type not supported";
        if (!isGlobalRanking) {
            try {
                const searchValue = nameOrRanking.toString();
                const normalizedName = normalizeNameLowerCase(searchValue);
                getHighScore(this._client, searchValue, listType, leagueId);
                /** @type {HighScore<PlayerHighScoreItem>} */
                const hghData = await WaitUntil(this._client._socket, `hgh_${listType}_${normalizedName}`, "", 1000);
                delete this._client._socket[`hgh_${listType}_${normalizedName}`];
                return convertHghLeaderboard(this._client, hghData);
            } catch (e) {
                throw Localize.text(this._client, e);
            }
        }
        try {
            const maxResults = 10;
            switch (typeof nameOrRanking) {
                case "number":
                    const searchRank = Math.round(Math.max(1, nameOrRanking - maxResults / 2));
                    listLeaderboardScoresPage(this._client, listType, searchRank, maxResults, leagueId);
                    /** @type {LeaderboardList} */
                    const leaderboardRankData = await WaitUntil(this._client._socket, `llsp_${listType}_${leagueId}_${searchRank}`, "", 5000);
                    delete this._client._socket[`llsp_${listType}_${leagueId}_${searchRank}`];
                    return convertListToLeaderboard(this._client, leaderboardRankData);
                case "string":
                    searchLeaderboardScores(this._client, listType, nameOrRanking);
                    /** @type {LeaderboardSearchList} */
                    const leaderboardSearchData = await WaitUntil(this._client._socket, `slse_${listType}`, "", 1000);
                    delete this._client._socket[`slse_${listType}`];
                    const {scoreId, leagueType} = leaderboardSearchData.items[0];
                    listLeaderboardScoresWindow(this._client, listType, scoreId, maxResults, leagueType);
                    /** @type {LeaderboardList} */
                    const leaderboardWindowData = await WaitUntil(this._client._socket, `llsw_${listType}_${leagueType}_${scoreId}`, "", 5000);
                    delete this._client._socket[`llsw_${listType}_${leagueType}_${scoreId}`];
                    return convertListToLeaderboard(this._client, leaderboardWindowData);
            }
        } catch (e) {
            throw Localize.text(this._client, e);
        }
    }
}

/**
 * @param {Client} client
 * @param {HighScore<PlayerHighScoreItem>} hghData
 * @returns {PlayerLeaderboard}
 */
function convertHghLeaderboard(client, hghData) {
    return {
        listType: hghData.listType,
        numScores: hghData.lastRow,
        leagueType: hghData.leagueId,
        items: hghData.items.map(i => {
            return {
                playerName: i.playerName ?? i.player.playerName,
                allianceName: undefined,
                instanceId: client._serverInstance.value,
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
 * @param {Client} client
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