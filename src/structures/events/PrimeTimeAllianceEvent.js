const ActiveEvent = require("./ActiveEvent");

class PrimeTimeAllianceEvent extends ActiveEvent {
    /** @type {number} */
    premiumBonus;

    /**
     * @param {Client} client
     * @param {{EID:number, RS: number, APP: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.premiumBonus = data.APP;
    }

    get offersHubType() {
        return {name: "primeTimeAlliance", id: 8}//OffersHubTypeEnum.PRIME_TIME_ALLIANCE;
    }

    get skinId() {
        return 1;
    }
}

module.exports = PrimeTimeAllianceEvent;