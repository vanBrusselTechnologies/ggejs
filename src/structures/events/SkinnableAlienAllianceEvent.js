const SkinnableAlienEvent = require("./SkinnableAlienEvent");
const PointEvent = require("./PointEvent");

class SkinnableAlienAllianceEvent extends SkinnableAlienEvent {
    /** @type {PointEvent} */
    singlePlayerPointEvent;

    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);

        this.parseBasicParams(data["A"]);
        this.singlePlayerPointEvent = new PointEvent();
        this.sourceZoneId = data["SZID"];
        this.targetZoneId = data["TZID"];
        this.rerollEnabled = data["CRE"] === 1;
        this.rerollCurrencyKeys = data["RCKS"];
        //TODO: alienRerollData.rerollSoftCurrencyCount = data["RCSC"];
        //TODO: alienRerollData.rerollHardCurrencyCount = data["RCHC"];
        const singlePlayerParams = data["SP"];
        if (singlePlayerParams) this.singlePlayerPointEvent.loadFromParamObject(client, singlePlayerParams);
        //todo: this.loadFromSkin(skinFactory.getSkinByEventID(this.eventId););
        this.subType = 1;
    }

    /** @return {number} */
    get allianceRanking() {
        return this.currentRank && this.currentRank.length > 1 ? this.currentRank[1] : 0;
    }

    /** @return {number} */
    get alliancePoints() {
        return this.currentPoints && this.currentPoints.length > 1 ? this.currentPoints[1] : 0;
    }
}

module.exports = SkinnableAlienAllianceEvent;