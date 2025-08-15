const PrimeSaleEvent = require("./PrimeSaleEvent");

class PrimeSaleBoosterEvent extends PrimeSaleEvent {
    /** @type {number[]} */
    boosterIds = [];

    /**
     * @param {BaseClient} client
     * @param {{EID:number, RS: number, BID: number[], DIS: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.boosterIds = data.BID;
    }

    get offersHubType() {
        return {name: "primeSaleBoosters", id: 10}// TODO: OffersHubTypeEnum.PRIME_SALE_BOOSTERS;
    }

    get skinId(){
        return 0
    }
}

module.exports = PrimeSaleBoosterEvent;