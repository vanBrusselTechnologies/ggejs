const PointEvent = require("./PointEvent");

class GachaEvent extends PointEvent {
    eventBuildingWodId = -1

    get starterDialogName() {
        return "";
    }

    get mailStarterDialogName() {
        return "MailStarterFullscreenDialog";
    }

    get webShopTabId() {
        return "supersale";
    }
}

module.exports = GachaEvent;