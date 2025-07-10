const PrimeSaleEvent = require("./PrimeSaleEvent");

class PrimeSaleRelicusEvent extends PrimeSaleEvent {
    get offersHubType() {
        return {name: "primeSaleRelicus", id: 19}// TODO: OffersHubTypeEnum.PRIME_SALE_RELICUS;
    }

    get skinId(){
        return 0
    }
}

module.exports = PrimeSaleRelicusEvent;