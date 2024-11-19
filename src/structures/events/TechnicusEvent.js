const ActiveEvent = require("./ActiveEvent");

class TechnicusEvent extends ActiveEvent {
    eventBuildingWodId = 296

    get eventTitleTextId() {
        return "eventBuilding_technicus";
    }

    get eventStarterDescTextId() {
        return "dialog_equipmentTechnicusEvent_starter";
    }

    get starterDialogName() {
        return "TechnicusStarterDialog";
    }

    get mainDialogName() {
        return "TechnicusDialog";
    }
}

module.exports = TechnicusEvent;