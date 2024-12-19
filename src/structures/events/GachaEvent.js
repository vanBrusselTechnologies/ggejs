const PointEvent = require("./PointEvent");

class GachaEvent extends PointEvent {
    eventBuildingWodId = -1

    get starterDialogName() {
        return "";
    }
}

module.exports = GachaEvent;