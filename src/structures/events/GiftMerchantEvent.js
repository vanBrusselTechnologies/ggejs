const ActiveEvent = require("./ActiveEvent");

class GiftMerchantEvent extends ActiveEvent {
    eventBuildingWodId = 318

    get eventTitleTextId() {
        return "eventBuilding_giftTrader";
    }

    get eventStarterDescTextId() {
        return "dialog_giftTrader_desc";
    }

    get starterDialogName() {
        return "GiftMerchantDialogStarter";
    }

    get mainDialogName() {
        return "GiftMerchantDialog";
    }
}

module.exports = GiftMerchantEvent;