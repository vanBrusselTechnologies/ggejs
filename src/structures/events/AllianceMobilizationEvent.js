const {DivisionRound} = require('e4k-data')
const PointEvent = require("./PointEvent");
const {divisionRounds} = require('e4k-data').data

class AllianceMobilizationEvent extends PointEvent {
    eventBuildingWodId = 4311

    /** @type {DivisionRound} */
    divisionRound;
    leaderboardRewardSetId;

    get rankingMode() {
        return this.divisionRound.type;
    }

    get starterDialogName() {
        return "AllianceMobilizationStartDialog";
    }

    get mailStarterDialogName() {
        return "AllianceMobilizationStartDialog";
    }

    get mailStarterMarkEventAsRead() {
        return true;
    }

    get allianceRanking() {
        return this.currentRank;
    }

    get alliancePoints() {
        return this.currentPoints;
    }

    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.parseBasicParams(data["A"]);
        this.subType = 1;
        this.leaderboardRewardSetId = data["LRSI"];
        const divisionRoundId = data["DRI"];
        this.divisionRound = divisionRounds.find(d => d.divisionRoundID === divisionRoundId)
        this.subdivisionId = data["A"]["SDI"];
    }
}

module.exports = AllianceMobilizationEvent;