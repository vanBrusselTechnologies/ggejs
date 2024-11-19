const ActiveEvent = require("./ActiveEvent");

class ResourceMerchantEvent extends ActiveEvent {
    get eventTitleTextId() {
        return "eventBuilding_Merchant";
    }

    get eventStarterDescTextId() {
        return "dialog_merchantEvent_speechBubble";
    }

    get starterDialogName() {
        return "SpecialEventsMerchantStarter";
    }

    get mainDialogName() {
        return "SpecialEventsMerchantDialog";
    }
}

module.exports = ResourceMerchantEvent;