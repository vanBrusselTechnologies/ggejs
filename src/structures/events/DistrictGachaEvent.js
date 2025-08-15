const GachaEvent = require("./GachaEvent");

class DistrictGachaEvent extends GachaEvent {
    get webShopTabId() {
        return "cashoffers";
    }
}

module.exports = DistrictGachaEvent;