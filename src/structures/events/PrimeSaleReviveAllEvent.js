const PrimeSaleEvent = require("./PrimeSaleEvent");

class PrimeSaleReviveAllEvent extends PrimeSaleEvent {
    get offersHubType() {
        return {name: "primeSaleReviveAll", id: 15}// TODO: OffersHubTypeEnum.PRIME_SALE_REVIVE_ALL;
    }

    get skinId(){
        return 0
    }
}

module.exports = PrimeSaleReviveAllEvent;