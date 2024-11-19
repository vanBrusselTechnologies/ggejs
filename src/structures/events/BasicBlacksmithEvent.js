const ActiveEvent = require("./ActiveEvent");

class BasicBlacksmithEvent extends ActiveEvent {
    eventBuildingWodId = 66

    get eventTitleTextId() {
        return "eventBuilding_wishCoinTrader";
    }

    get eventStarterDescTextId() {
        return "dialog_wishCoinTrader_desc";
    }
}

module.exports = BasicBlacksmithEvent;