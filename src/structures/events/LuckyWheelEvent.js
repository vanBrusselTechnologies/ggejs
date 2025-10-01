const BaseLuckyWheelEvent = require("./BaseLuckyWheelEvent");

class LuckyWheelEvent extends BaseLuckyWheelEvent {
    eventBuildingWodId = 48

    get eventTitleTextId() {
        return "eventBuilding_luckyWheel";
    }

    get eventStarterDescTextId() {
        return "dialog_luckyWheel_text_first";
    }

    get eventStartDescText2() {
        return "dialog_luckyWheel_text_second";
    }

    get starterDialogName() {
        return "SpecialEventWheelOfFortuneStarterDialog";
    }

    get mainDialogName() {
        return "WheelOfFortuneMainDialog";
    }

    get eventStarterCharacterId() {
        return "char_event_harlequin";
    }

    get serverTypeId() {
        return 0;
    }
}

module.exports = LuckyWheelEvent;