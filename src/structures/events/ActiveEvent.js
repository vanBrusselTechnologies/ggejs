const EventAutoScalingConst = require("../../utils/EventAutoScalingConst");
const {events, packages} = require('e4k-data').data;
const {Package, Event} = require('e4k-data');

class ActiveEvent {
    eventBuildingWodId = -1

    /** @type {number} */
    eventId;
    /** @type {Date} */
    endTime;
    /** @type {string} */
    eventType;
    /** @type {number} */
    minLevel;
    /** @type {number} */
    maxLevel;
    /** @type {number[]} */
    kingdomIds = [];
    /** @type {number[]} */
    allowedAreaTypes = [];
    /** @type {Package[]} */
    eventPackages = [];
    /** @type {boolean} */
    openWithLogin;
    /** @type {number} */
    merchantId;
    /** @type {number[]} */
    mapIds = [];
    /** @type {"Adventure" | "Trader" | null} */// TODO: EventHubTypeEnum
    hubType;
    /** @type {"Long" | "Short" | null} */// TODO: EventDurationTypeEnum
    eventDurationType;
    /** @type {number} */
    difficultyId;
    /** @type {boolean} */
    autoScalingEnabled;

    /** @type {Event} */
    rawData

    constructor() {
        this.difficultyId = EventAutoScalingConst.CLASSIC_EVENT_DIFFICULTY;
    }

    loadFromParamObject(client, data){
        this.eventId = data["EID"];
        this.endTime = new Date(Date.now() + data["RS"] * 1000);
        this.difficultyId = data["EDID"];
        this.autoScalingEnabled = data["EASE"];

        if (data["PIDS"]) data["PIDS"].toString().split(",").forEach(v => this._addEventPackageById(parseInt(v)));

        const event = events.find(e => e.eventID === this.eventId);
        if (event == null) return;
        this.rawData = event
        this.mapIds = (event.mapID ?? "-1").split(",").map(v => parseInt(v));
        this.eventType = event.eventType;
        this.minLevel = event.minLevel ?? 0;
        this.maxLevel = event.maxLevel ?? 99;
        this.openWithLogin = (event.openWithLogin ?? 0) === 1
        this.kingdomIds = (event.kIDs ?? 0).toString().split(",").map(v => parseInt(v));
        this.allowedAreaTypes = (event.areaTypes ?? 1).toString().split(",").map(v => parseInt(v));
        this.merchantId = event.merchantID ?? 0;
        if (event.packageIDs) event.packageIDs.toString().split("+").forEach(v => this._addEventPackageById(parseInt(v)));
        this.hubType = event.hubType;//EventHubTypeEnum.getHubTypeEnumById(params.@hubType[0]);
        this.eventDurationType = event.eventDuration//EventDurationTypeEnum.getEventDurationTypeEnumById(params.@eventDuration[0]);
    }

    /** @param {number} packageId */
    _addEventPackageById(packageId) {
        if (this.eventPackages.map(p => p.packageID).includes(packageId)) return;
        const _package = packages.find(p => p.packageID === packageId)
        if (_package) this.eventPackages.push(_package);
    }

    get isActive() {
        return this.endTime.getTime() < Date.now();
    };

    get eventTitleTextId() {
        return `event_title_${this.eventId}`;
    }

    get eventStarterDescTextId() {
        return "";
    }

    get hasUserSolvedEvent() {
        return false;
    }

    get isVisible() {
        return true;
    }

    get isShownInDropDownMenu() {
        return false;
    }

    get name() {
        return this.eventType;
    }

    get mailStarterDialogName() {
        return null;
    }

    get mailStarterMarkEventAsRead() {
        return false
    }

    get mainDialogName() {
        return null;
    }

    get starterDialogName() {
        return null
    }
}

module.exports = ActiveEvent;