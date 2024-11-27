const ActiveEvent = require("./ActiveEvent");
const {Reward} = require('e4k-data');

class PointEvent extends ActiveEvent {
    eventBuildingWodId = 397

    /** @type {number} */
    leageId;
    /** @type {number} */
    subType;
    /** @type {number[]} */
    currentPoints = [];
    /** @type {number[]} */
    currentRank = [];
    /** @type {number} */
    taskType;
    /** @type {Reward[]} */ // todo: Reward should be parsed class version of Reward raw data class
    rewards = [];
    /** @type {number} */
    totalTimeInHours;
    /** @type {number} */
    rewardSetId;
    /** @type {any} */// TODO: IPointEventCustomPropertiesVO
    customProperties;

    /**
     * @param {Client} client
     * @param {{EID: number, RS: number, OP: number|number[], OR: number|number[], LID: number, PET: number, RSID: number, R: [][][], SC: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.parseBasicParams(data)
    }

    /** @param {{EID: number, RS: number, OP: number|number[], OR: number|number[], LID: number, PET: number, RSID: number, R: [][][], SC: number}} data */
    parseBasicParams(data) {
        if (data["LID"]) {
            this.leagueId = data["LID"];
        }
        if (Array.isArray(data["OP"])) {
            this.currentPoints = data["OP"];
        } else {
            this.currentPoints = [data["OP"]];
        }
        if (Array.isArray(data["OR"])) {
            this.currentRank = data["OR"];
        } else {
            this.currentRank = [data["OR"]];
        }
        if (data["PET"]) {
            this.taskType = data["PET"];
        }
        if (data["R"]) {
            this.rewards = this.parsePointEventRewards(data["R"]);
        }
        if (data["TH"]) {
            this.totalTimeInHours = data["TH"];
        }
        if (data["ST"]) {
            this.subType = data["ST"];
        }
        if (data["RSID"]) {
            this.rewardSetId = data["RSID"];
        }
    }

    /**
     * @param rawRewards
     * @return {Object}
     */
    parsePointEventRewards(rawRewards) {
        const dict = {};
        let i = rawRewards.length - 1;
        while (i >= 0) {
            // TODO: dict[PointEventRewardTierEnum.TIER_NAMES[i]] = rewardParser.parseRewards(rawRewards[i]);
            i--;
        }
        return dict;
    }

    get eventTitleTextId() {
        return "eventBuilding_PointEvent";
    }

    get eventStarterDescTextId() {
        return "dialog_pointEvent_eventcamp_message";
    }

    get starterDialogName() {
        return "SpecialEventsPointEventDialogStarter";
    }

    get mainDialogName() {
        return "SpecialEventsPointEventDialog";
    }
}

module.exports = PointEvent;