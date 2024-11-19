const ActiveEvent = require("./ActiveEvent");

class EquipmentMerchantEvent extends ActiveEvent {
    eventBuildingWodId = 277

    get eventTitleTextId() {
        return "eventBuilding_equipmentTrader";
    }

    get eventStarterDescTextId() {
        return "dialog_equipmentTraderEvent_start_description";
    }

    get starterDialogName() {
        return "EquipmentMerchantStarterDialog";
    }

    get mainDialogName() {
        return "EquipmentMerchantDialog";
    }
}

module.exports = EquipmentMerchantEvent;