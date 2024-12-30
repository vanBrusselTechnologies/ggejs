const PointEvent = require("./PointEvent");

class SkinnableAlienEvent extends PointEvent {
    /** @type {string} */
    _eventBuildingName;
    /** @type {string} */
    _eventStarterDescText;
    /** @type {number} */
    targetZoneId;
    /** @type {number} */
    sourceZoneId;
    /** @type {number} */
    skinId;
    /** @type {boolean} */
    rerollEnabled;
    /** @type {string[]} */
    rerollCurrencyKeys = [];
    /** @type {boolean} */
    isSeasonLeagueModeEnabled;

    loadFromParamObject(client, data){
        super.loadFromParamObject(client, data);
        this.isSeasonLeagueModeEnabled = data["KL"] === 1;
        this.parseBasicParams(data);
        this.sourceZoneId = data["SZID"];
        this.targetZoneId = data["TZID"];
        //todo: this.loadFromSkin(skinFactory.getSkinByEventID(this.eventId));
    }

    loadFromSkin(skin/*TODO :IAlienProperties*/) {
        this.eventBuildingWodId = skin.eventBuildingWOD;
        this._eventBuildingName = skin.getText(0);
        this._eventStarterDescText = skin.getText(1);
    }

    get eventTitleTextId() {
        return this._eventBuildingName;
    }

    get eventStarterDescTextId() {
        return this._eventStarterDescText;
    }

    get mailStarterDialogName() {
        return "SkinnableAlienStarterMailDialog";
    }

    get mainDialogName() {
        return "SkinnableAlienContestDialog";
    }

    get starterDialogName() {
        return "SkinnableAlienAllianceStarterDialog";
    }
}

module.exports = SkinnableAlienEvent;