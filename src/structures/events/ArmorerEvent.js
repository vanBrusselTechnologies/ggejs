const ActiveEvent = require("./ActiveEvent");

class ArmorerEvent extends ActiveEvent {
    eventBuildingWodId = 220

    get eventTitleTextId() {
        return "eventBuilding_Armorer";
    }

    get eventStarterDescTextId() {
        return "dialog_armorerEvent_speechBubble";
    }

    get starterDialogName() {
        return "ArmorerMerchantStarterDialog";
    }

    get mainDialogName() {
        return "ArmorerMerchantDialog";
    }
}

module.exports = ArmorerEvent;