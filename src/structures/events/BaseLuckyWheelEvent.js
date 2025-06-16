const PointEvent = require("./PointEvent");
const {execute: lws} = require("../../commands/onReceived/lws.js");

class BaseLuckyWheelEvent extends PointEvent {
    eventBuildingWodId = 48

    /** @type {boolean} */
    isProMode;
    /** @type {number} */
    currentWinClass;
    /** @type {number} */
    winClassProgress;
    /** @type {boolean} */
    hasFreeSpin;
    /** @type {boolean} */
    hasVisitedProMode;
    /** @type {number} */
    _currentJackpotSetId = -1;
    /** @type {number} */
    _nextJackpotSetId = -1;
    /** @type {number} */
    _nextJackpotSpinJackpotSet = 0;
    /** @type {number} */
    _currentJackpotSpinJackpotSet;
    /** @type {number} */
    winningCategory = -1;
    /** @type {boolean} */
    hasLevelUp;

    /**
     * @param {Client} client
     * @param {Object} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.parseBasicParams(data);
        if (data["CR"]) {
            const collectedRewards = data["CR"];
            const ungroupedRewards = ungroupRewardsFromServer(data["R"])//TODO: RewardJSONParser.ungroupRewardsFromServer(data["R"]);
            const rewards = collectedRewards.concat(ungroupedRewards);
            this.rewards = this.parsePointEventRewards(rewards);
        }
        //TODO: const _loc6_:IWheelOfFortuneProperties = propertiesFactory.getPropertiesByEventId(this.eventId);
        data["LWET"] = this.eventId === 15 ? 0 : 1//_loc6_.serverTypeId;
        lws(client, 0, data)
    }

    get eventTitleTextId() {
        return "eventBuilding_luckyWheel";
    }

    get eventStarterDescTextId() {
        return "dialog_luckyWheel_text_first";
    }

    get eventStartDescText2() {
        return "dialog_luckyWheel_text_second";
    }

    get starterDialogName() {
        return "SpecialEventWheelOfFortuneStarterDialog";
    }

    get mainDialogName() {
        return "WheelOfFortuneSaleDaysMainDialog";
    }

    get currentJackpotSetId() {
        return this._currentJackpotSetId !== -1 ? this._currentJackpotSetId : this._nextJackpotSetId;
    }

    /** @param {number} value */
    set nextJackpotSetId(value) {
        this._currentJackpotSetId = this._nextJackpotSetId;
        this._nextJackpotSetId = value;
    }

    get nextJackpotSpinJackpotSet() {
        return this._nextJackpotSpinJackpotSet;
    }

    /** @param {number} value */
    set nextJackpotSpinJackpotSet(value) {
        this._currentJackpotSpinJackpotSet = this._nextJackpotSpinJackpotSet;
        this._nextJackpotSpinJackpotSet = value;
    }

    get currentJackpotSpinJackpotSet() {
        return this._currentJackpotSpinJackpotSet !== -1 ? this._currentJackpotSpinJackpotSet : this._nextJackpotSpinJackpotSet;
    }

    get eventStarterCharacterId() {
        return "";
    }
}

/**
 * @param {Array<any>} rewards
 * @return {Array}
 */
function ungroupRewardsFromServer(rewards) {
    const output = [];
    for (const array of rewards) {
        if (Array.isArray(array) && Array.isArray(array[0])) {
            for (const subArray of array) {
                output.push(subArray);
            }
        } else {
            output.push(array);
        }
    }
    return output;
}

module.exports = BaseLuckyWheelEvent;