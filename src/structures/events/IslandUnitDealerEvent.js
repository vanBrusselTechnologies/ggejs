const ActiveEvent = require("./ActiveEvent");

class IslandUnitDealerEvent extends ActiveEvent {
    eventBuildingWodId = 290

    get eventTitleTextId() {
        return "dialog_island_toolShop_tooltip";
    }

    get eventStarterDescTextId() {
        return "dialog_island_toolShop_copy";
    }

    get starterDialogName() {
        return "IslandUnitDealerMerchantStarterDialog";
    }

    get mainDialogName() {
        return "IslandUnitDealerMerchantDialog";
    }
}

module.exports = IslandUnitDealerEvent;