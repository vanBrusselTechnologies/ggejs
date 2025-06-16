const PointEvent = require("./PointEvent");

class AllianceMobilizationEvent extends PointEvent {
    rankingMode;
    leaderboardRewardSetId;

    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.rankingMode = "qualification"; //TODO: new LeaderboardDivisionMode("qualification",2,instantiationKey);
        this.leaderboardRewardSetId = 1;
    }
}

module.exports = AllianceMobilizationEvent;