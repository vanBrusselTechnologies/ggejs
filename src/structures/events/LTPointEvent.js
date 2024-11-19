const PointEvent = require("./PointEvent");

class LTPointEvent extends PointEvent {
    /** @type {number[]} */
    upcomingEvents;
    /** @type {number} */
    skinId;

    /**
     * @param {Client} client
     * @param {{EID: number, RS: number, OP: number[], OR:number[], UE: number[], LID: number, SID: number, RSID: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.parseBasicParams(data);
        if (data["UE"]) {
            this.upcomingEvents = data["UE"]
        } else {
            this.upcomingEvents = [];
        }
        this.skinId = data["SID"];
        //TODO: this.eventBuildingWodId = settingsService.getSkinSettingCreator(this.skinId).getSkinSettingsVO().eventBuildingWOD;
    }

    get mainDialogName() {
        return "LTPointEventMainDialog";
    }

    get starterDialogName() {
        return "LTPointEventDialogStarter";
    }

    get eventTitleTextId() {
        return "eventBuilding_longPointEvent";
    }
}

module.exports = LTPointEvent;