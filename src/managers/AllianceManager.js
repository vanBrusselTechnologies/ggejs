'use strict'

const BaseManager = require('./BaseManager');
const {execute: searchAllianceById} = require('../e4kserver/commands/searchAllianceById');
const {WaitUntil} = require('../tools/wait');
const Localize = require("../tools/Localize");
const {execute: getHighScore} = require("../e4kserver/commands/getHighScore");
const HighscoreConst = require("../utils/HighscoreConst");

class AllianceManager extends BaseManager {
    /**
     * @param {number} id
     * @returns {Promise<Alliance | MyAlliance>}
     */
    async getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (id == null) {
                    reject('Missing alliance id!');
                    return;
                }
                const socket = this._socket;
                searchAllianceById(socket, id);
                const alliance = await WaitUntil(socket, `_alliance_${id}_data`, "", 1000);
                delete socket[`_alliance_${id}_data`];
                resolve(alliance);
            } catch (e) {
                reject(Localize.text(this._client, 'errorCode_114'));
            }
        });
    }

    /**
     * @param {string} name
     * @returns {Promise<Alliance | MyAlliance>}
     */
    async find(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const hghData = await this.getRankings(name, 'might');
                const allianceId = hghData.items.find(item => item.rank === hghData.foundRank).alliance.allianceId;
                resolve(await this.getById(allianceId));
            } catch (e) {
                reject(Localize.text(this._client, 'errorCode_114'));
            }
        });
    }

    /** @returns {Promise<MyAlliance>} */
    getMyAlliance() {
        return new Promise(async (resolve, reject) => {
            try {
                const allianceId = this._client.clientUserData.allianceId;
                if (allianceId === -1) reject("You are not in an alliance!");
                let alliance = this.getById(allianceId);
                resolve(alliance);
            } catch (e) {
                reject(Localize.text(this._client, 'errorCode_114'));
            }
        })
    }

    /**
     * @param {string | number} nameOrRanking
     * @param {AllianceHighScoreRankingTypes} rankingType
     * @param {number} leagueId
     * @returns {Promise<HighScore<AllianceHighScoreItem>>}
     */
    getRankings(nameOrRanking, rankingType = "might", leagueId = 1) {
        return new Promise(async (resolve, reject) => {
            const searchValue = nameOrRanking.toString();
            const normalizedName = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const listType = (() => {
                switch (rankingType) {
                    case "honor":
                        return HighscoreConst.ALLIANCE_HONOR;
                    case "might":
                        return HighscoreConst.ALLIANCE_MIGHT_POINTS;
                    case "landMarks":
                        return HighscoreConst.ALLIANCE_LANDMARKS;
                    case "aqua":
                        return HighscoreConst.ALLIANCE_AQUA_POINTS;
                    case "tournamentFame":
                        return HighscoreConst.ALLIANCE_TOURNAMENT_FAME;
                    case "alienInvasion":
                        return HighscoreConst.ALLIANCE_ALIEN_INVASION_ALLIANCE;
                    case "nomadInvasion":
                        return HighscoreConst.ALLIANCE_NOMADINVASION_ALLIANCE;
                    case "samuraiInvasion":
                        return HighscoreConst.SAMURAI_ALLIANCE;
                    case "redAlienInvasion":
                        return HighscoreConst.ALLIANCE_RED_ALIEN_INVASION_ALLIANCE;
                    case "kingdomsLeagueSeason":
                        return HighscoreConst.ALLIANCE_KINGDOMS_LEAGUE_SEASON;
                    case "kingdomsLeagueSeasonEvent":
                        return HighscoreConst.ALLIANCE_KINGDOMS_LEAGUE_SEASON_EVENT;
                    case "daimyo":
                        return HighscoreConst.ALLIANCE_DAIMYO;
                    case "allianceBattleGroundCollector":
                        return HighscoreConst.ALLIANCE_BATTLE_GROUND_ALLIANCE_COLLECTOR;
                    case "allianceBattleGroundTower":
                        return HighscoreConst.ALLIANCE_BATTLE_GROUND_ALLIANCE_TOWER;
                    case "allianceBattleGroundPreviousRun":
                        return HighscoreConst.ALLIANCE_BATTLE_GROUND_PREVIOUS_RUN_ALLIANCE;
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

module.exports = AllianceManager