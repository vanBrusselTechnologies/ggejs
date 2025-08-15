const PrimeSaleEvent = require("./PrimeSaleEvent");

class PrimeSaleBuildingsEvent extends PrimeSaleEvent {
    /** @type {number} */
    wodId;

    /**
     * @param {BaseClient} client
     * @param {{EID:number, RS: number, WID: number, DIS: number}} data
     */
    loadFromParamObject(client, data){
        super.loadFromParamObject(client, data);
        this.wodId = data.WID
    }

    get offersHubType() {
        return {name: "primeSaleBuildings", id: 11}// TODO: OffersHubTypeEnum.PRIME_SALE_BUILDINGS;
    }

    get skinId() {
        return 0
    }
}

module.exports = PrimeSaleBuildingsEvent;