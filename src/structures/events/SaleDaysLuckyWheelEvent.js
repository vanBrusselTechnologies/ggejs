const BaseLuckyWheelEvent = require("./BaseLuckyWheelEvent");

class SaleDaysLuckyWheelEvent extends BaseLuckyWheelEvent {
    eventBuildingWodId = 1897

    get eventTitleTextId() {
        return "eventBuilding_luckyWheel_saleDays";
    }

    get eventStarterDescTextId() {
        return "dialog_luckyWheel_saleDays_text_first";
    }

    get eventStartDescText2() {
        return "dialog_luckyWheel_saleDays_text_second";
    }

    get starterDialogName() {
        return "SpecialEventWheelOfFortuneStarterDialog";
    }

    get mainDialogName() {
        return "WheelOfFortuneSaleDaysMainDialog";
    }

    get eventStarterCharacterId() {
        return "char_event_harlequin_salesday";
    }

    get serverTypeId() {
        return 1;
    }
}

module.exports = SaleDaysLuckyWheelEvent;