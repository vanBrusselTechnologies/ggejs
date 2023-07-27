const {events, packages} = require('e4k-data').data;

class ActiveEvent {
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
    kingdomIds;
    /** @type {number[]} */
    allowedAreaTypes;
    /** @type {*[]} *///PackageStaticVO[]
    eventPackages = [];
    /** @type {boolean} */
    openWithLogin;
    /** @type {number} */
    merchantId;
    /** @type {number[]} */
    mapIds;
    /** @type {any} *///EventHubTypeEnum
    hubType;
    /** @type {any} *///EventDurationTypeEnum
    eventDurationType;
    /** @type {number} */
    difficultyId;
    /** @type {boolean} */
    autoScalingEnabled;

    constructor(client, data) {
        this.kingdomIds = [];
        this.allowedAreaTypes = [];
        this.mapIds = [];
        this.difficultyId = 0;//EventAutoScalingConst.CLASSIC_EVENT_DIFFICULTY;
        this.eventId = data["EID"];
        this.endTime = new Date(Date.now() + data["RS"] * 1000);
        this.difficultyId = data["EDID"];
        this.autoScalingEnabled = data["EASE"];
        if (data["PIDS"]) data["PIDS"].toString().split(",").forEach(v => this._addEventPackageById(parseInt(v)));
        const event = events.find(e => e.eventID === this.eventId);
        if (event == null) return;
        this.mapIds = (event.mapID || "-1").split(",").map(v => parseInt(v));
        this.eventType = event.eventType;
        this.minLevel = event.minLevel || 0;
        this.maxLevel = event.maxLevel || 99;
        this.openWithLogin = (event.openWithLogin || 0) === 1
        this.kingdomIds = (event.kIDs || 0).toString().split(",").map(v => parseInt(v));
        this.allowedAreaTypes = (event.areaTypes || 1).toString().split(",").map(v => parseInt(v));
        this.merchantId = event.merchantID || 0;
        event.packageIDs.toString().split("+").forEach(v => this._addEventPackageById(parseInt(v)));
        this.hubType = event.hubType;//EventHubTypeEnum.getHubTypeEnumById(params.@hubType[0]);
        this.eventDurationType = event.eventDuration//EventDurationTypeEnum.getEventDurationTypeEnumById(params.@eventDuration[0]);
    }

    get isActive() {
        return false
    };

    get eventBuildingWodId() {
        return -1;
    }

    get eventTitleTextId() {
        return "event_title_" + this.eventId;
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

    /**
     *
     * @param {number} packageId
     * @private
     */
    _addEventPackageById(packageId) {
        let _package = packages.find(p => p.packageID === packageId)
        if (_package) this.eventPackages.push(_package);
    }
}

module.exports = ActiveEvent;