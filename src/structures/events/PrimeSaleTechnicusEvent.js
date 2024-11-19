const PrimeSaleEvent = require("./PrimeSaleEvent");

class PrimeSaleTechnicusEvent extends PrimeSaleEvent {
    requiredEventIds = [46];

    get offersHubType() {
        return {name: "primeSaleTechnicus", id: 12}//TODO: OffersHubTypeEnum.PRIME_SALE_TECHNICUS;
    }

    get skinId() {
        return 0
    }
}

module.exports = PrimeSaleTechnicusEvent;