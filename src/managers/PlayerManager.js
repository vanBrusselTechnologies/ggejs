'use strict'

const BaseManager = require('./BaseManager');
const {execute: getDetailedPlayerInfo} = require('../e4kserver/commands/getDetailedPlayerInfo');
const {execute: searchPlayer} = require('../e4kserver/commands/searchPlayer');
const {WaitUntil} = require('../tools/wait');
const Localize = require("../tools/Localize");
const {execute: getHighScore} = require("../e4kserver/commands/getHighScore");
const HighscoreConst = require("../utils/HighscoreConst");

class PlayerManager extends BaseManager {
    get _socket() {
        if (super._socket[`__requesting_players`] === undefined) {
            super._socket[`__requesting_players`] = [];
        }
        return super._socket;
    }

    /**
     * @param {number} id
     * @returns {Promise<Player>}
     */
    getById(id) {
        return new Promise(async (resolve, reject) => {
            /** @type {Array} */
            const reqPlayers = this._socket[`__requesting_players`]
            try {
                if (!reqPlayers.includes(id)) getDetailedPlayerInfo(this._socket, id);
                reqPlayers.push(id);
                const player = await WaitUntil(this._socket, `__get_player_${id}`, "__get_player_error");
                reqPlayers.splice(reqPlayers.indexOf(id), 1);
                if (!reqPlayers.includes(id)) delete this._socket[`__get_player_${id}`];
                resolve(player);
            } catch (e) {
                reqPlayers.splice(reqPlayers.indexOf(id), 1);
                delete this._socket["__get_player_error"];
                reject(Localize.text(this._socket.client, e));
            }
        });
    }

    /**
     * @param {string} name
     * @returns {Promise<Player>}
     */
    find(name) {
        return new Promise(async (resolve, reject) => {
            const normalizedName = name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            try {
                /** @type {number} */
                let playerId;
                try { // Try to find user by rankings, on fail use world map find
                    const hghData = await this.getRankings(name, 'might');
                    playerId = hghData.items.find(item => item.rank === hghData.foundRank).player.playerId;
                } catch (e) {
                    searchPlayer(this._socket, name);
                    playerId = await WaitUntil(this._socket, `__search_player_${normalizedName}`, "__search_player_error", 1000);
                    delete this._socket[`__search_player_${normalizedName}`];
                }
                resolve(await this.getById(playerId));
            } catch (e) {
                delete this._socket[`hgh_6_${normalizedName}`];
                delete this._socket[`__search_player_${normalizedName}`];
                delete this._socket["__search_player_error"];
                reject(Localize.text(this._socket.client, e));
            }
        });
    }

    /** @returns {Promise<Player>} */
    async getThisPlayer() {
        if (this._client.clientUserData.playerId === -1) return null
        return await this.getById(this._client.clientUserData.playerId);
    }

    /**
     * @param {string | number} nameOrRanking
     * @param {PlayerHighScoreRankingTypes} rankingType
     * @param {number} leagueId
     * @returns {Promise<HighScore<PlayerHighScoreItem>>}
     */
    getRankings(nameOrRanking, rankingType = "might", leagueId = 1) {
        return new Promise(async (resolve, reject) => {
            const searchValue = nameOrRanking.toString();
            const normalizedName = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const listType = (() => {
                switch (rankingType) {
                    case "achievementPoints":
                        return HighscoreConst.PLAYER_ACHIEVEMENT_POINTS;
                    case "loot":
                        return HighscoreConst.PLAYER_WEEKLY_LOOT;
                    case "honor":
                        return HighscoreConst.PLAYER_HONOR;
                    case "might":
                        return HighscoreConst.PLAYER_MIGHT_POINTS;
                    case "legendLevel":
                        return HighscoreConst.PLAYER_LEGEND;
                    case "factionTournament":
                        return HighscoreConst.FACTION_TOURNAMENT;
                    case "pointEvent":
                        return HighscoreConst.POINT_EVENT;
                    case "luckyWheel":
                        return HighscoreConst.LUCKY_WHEEL;
                    case "alienInvasion":
                        return HighscoreConst.ALLIANCE_ALIEN_INVASION_PLAYER;
                    case "nomadInvasion":
                        return HighscoreConst.ALLIANCE_NOMADINVASION_PLAYER;
                    case "colossus":
                        return HighscoreConst.COLOSSUS;
                    case "samuraiInvasion":
                        return HighscoreConst.SAMURAI_PLAYER;
                    case "longTermPointEvent":
                        return HighscoreConst.LONG_TERM_POINT_EVENT;
                    case "redAlienInvasion":
                        return HighscoreConst.ALLIANCE_RED_ALIEN_INVASION_PLAYER;
                    case "tempServerDailyMight":
                        return HighscoreConst.TEMP_SERVER_DAILY_MIGHT_POINTS_BUILDINGS;
                    case "tempServerGlobal":
                        return HighscoreConst.TEMP_SERVER_GLOBAL;
                    case "kingdomsLeagueSeason":
                        return HighscoreConst.KINGDOMS_LEAGUE_SEASON;
                    case "kingdomsLeagueSeasonEvent":
                        return HighscoreConst.KINGDOMS_LEAGUE_SEASON_EVENT;
                    case "tempServerDailyCollector":
                        return HighscoreConst.TEMP_SERVER_DAILY_COLLECTOR_POINTS;
                    case "tempServerDailyRankSwap":
                        return HighscoreConst.TEMP_SERVER_DAILY_RANK_SWAP;
                    case "allianceBattleGroundCollector":
                        return HighscoreConst.ALLIANCE_BATTLE_GROUND_PLAYER_COLLECTOR;
                    case "SaleDaysLuckyWheel":
                        return HighscoreConst.LUCKY_WHEEL_SALE_DAYS;
                    case "allianceBattleGroundTower":
                        return HighscoreConst.ALLIANCE_BATTLE_GROUND_PLAYER_TOWER;
                    case "tempServerPreviousRun":
                        return HighscoreConst.TEMPSERVER_PREVIOUS_RUN_PLAYER;
                    case "allianceBattleGroundPreviousRun":
                        return HighscoreConst.ALLIANCE_BATTLE_GROUND_PREVIOUS_RUN_PLAYER;
                    case "donationEvent":
                        return HighscoreConst.DONATION_EVENT;
                    case "decoGachaEvent":
                        return HighscoreConst.DECO_GACHA_EVENT;
                    case "christmasGachaEvent":
                        return HighscoreConst.CHRISTMAS_GACHA_EVENT;
                    default:
                        reject("Rankings' list type not supported");
                        return -1
                }
            })()
            if (listType === -1) return;
            try {
                getHighScore(this._socket, searchValue, listType, leagueId);
                const hghData = await WaitUntil(this._socket, `hgh_${listType}_${normalizedName}`, "", 1000);
                delete this._socket[`hgh_${listType}_${normalizedName}`];
                return resolve(hghData)
            } catch (e) {
                delete this._socket[`hgh_${listType}_${normalizedName}`];
                reject(Localize.text(this._socket.client, e));
            }
        });
    }
}

module.exports = PlayerManager