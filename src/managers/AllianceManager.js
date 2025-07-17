'use strict'

const BaseManager = require('./BaseManager');
const {getAllianceInfo} = require('../commands/ain');
const {getHighScore} = require("../commands/hgh");
const EmpireError = require("../tools/EmpireError");
const HighScoreConst = require("../utils/HighScoreConst");

class AllianceManager extends BaseManager {
    /** @param {number} id */
    async getById(id) {
        try {
            return await getAllianceInfo(this._client, id);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    }

    /** @param {string} name */
    async find(name) {
        const ranking = await this.getRankings(name, 'might');
        const allianceId = ranking.items.find(item => item.rank === ranking.foundRank).alliance.allianceId;
        return await this.getById(allianceId);
    }

    /** @returns {Promise<MyAlliance>} */
    async getMyAlliance() {
        const allianceId = this._client.clientUserData.allianceId;
        if (allianceId === -1) throw new EmpireError(this._client, "You are not in an alliance!");
        return await this.getById(allianceId);
    }

    /**
     * @param {string | number} nameOrRanking
     * @param {AllianceHighScoreRankingTypes} rankingType
     * @param {number} leagueId
     * @returns {HighScore<AllianceHighScoreItem>}
     */
    async getRankings(nameOrRanking, rankingType = "might", leagueId = 1) {
        const searchValue = nameOrRanking.toString();
        const listType = (() => {
            switch (rankingType) {
                case "honor":
                    return HighScoreConst.ALLIANCE_HONOR;
                case "might":
                    return HighScoreConst.ALLIANCE_MIGHT_POINTS;
                case "landMarks":
                    return HighScoreConst.ALLIANCE_LANDMARKS;
                case "aqua":
                    return HighScoreConst.ALLIANCE_AQUA_POINTS;
                case "tournamentFame":
                    return HighScoreConst.ALLIANCE_TOURNAMENT_FAME;
                case "alienInvasion":
                    return HighScoreConst.ALLIANCE_ALIEN_INVASION_ALLIANCE;
                case "nomadInvasion":
                    return HighScoreConst.ALLIANCE_NOMADINVASION_ALLIANCE;
                case "samuraiInvasion":
                    return HighScoreConst.SAMURAI_ALLIANCE;
                case "redAlienInvasion":
                    return HighScoreConst.ALLIANCE_RED_ALIEN_INVASION_ALLIANCE;
                case "kingdomsLeagueSeason":
                    return HighScoreConst.ALLIANCE_KINGDOMS_LEAGUE_SEASON;
                case "kingdomsLeagueSeasonEvent":
                    return HighScoreConst.ALLIANCE_KINGDOMS_LEAGUE_SEASON_EVENT;
                case "daimyo":
                    return HighScoreConst.ALLIANCE_DAIMYO;
                case "allianceBattleGroundCollector":
                    return HighScoreConst.ALLIANCE_BATTLE_GROUND_ALLIANCE_COLLECTOR;
                case "allianceBattleGroundTower":
                    return HighScoreConst.ALLIANCE_BATTLE_GROUND_ALLIANCE_TOWER;
                case "allianceBattleGroundPreviousRun":
                    return HighScoreConst.ALLIANCE_BATTLE_GROUND_PREVIOUS_RUN_ALLIANCE;
                default:
                    return -1;
            }
        })();
        if (listType === -1) throw new EmpireError(this._client, "Rankings' list type not supported");
        try {
            return await getHighScore(this._client, searchValue, listType, leagueId);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    }
}

module.exports = AllianceManager;