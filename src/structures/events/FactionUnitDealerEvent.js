const ActiveEvent = require("./ActiveEvent");

class FactionUnitDealerEvent extends ActiveEvent {
    eventBuildingWodId = 634

    get eventTitleTextId() {
        return "eventBuilding_Armorer";
    }

    get eventStarterDescTextId() {
        return "dialog_armorerEvent_speechBubble";
    }

    get starterDialogName() {
        return "FactionUnitDealerMerchantStarterDialog";
    }

    get mainDialogName() {
        return "FactionUnitDealerMerchantDialog";
    }
}

module.exports = FactionUnitDealerEvent;