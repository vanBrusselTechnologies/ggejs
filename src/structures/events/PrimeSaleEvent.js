const ActiveEvent = require("./ActiveEvent");
const EventConst = require("../../utils/EventConst");

class PrimeSaleEvent extends ActiveEvent {
    /** @type {string} */ // TODO: PrimeSaleTypeEnum
    primeSaleType;
    /** @type {number} */
    discount;
    /** @type {number[]} */
    requiredEventIds = [];

    /**
     * @param {BaseClient} client
     * @param {{EID:number, RS: number, DIS: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.discount = data.DIS;
        this.primeSaleType = getPrimeSaleType(this.eventId);
    }
}

/**
 * @param {number} eventId
 * @return {string} todo: PrimeSaleTypeEnum
 */
function getPrimeSaleType(eventId) {
    switch (eventId) {
        case EventConst.EVENTTYPE_EVENT_BOOSTER_PRIME_SALE:
            return "booster"//PrimeSaleTypeEnum.BOOSTER;
        case EventConst.EVENTTYPE_PRIME_SALES_REVIVE_ALL:
            return "revive_all"//PrimeSaleTypeEnum.REVIVE_ALL;
        case EventConst.EVENTTYPE_PRIME_SALES_TECHNICUS:
            return "technicus"//PrimeSaleTypeEnum.TECHNICUS;
        case EventConst.EVENTTYPE_PRIME_SALES_RELIC_ENCHANTER:
            return "relicus"//PrimeSaleTypeEnum.RELICUS;
        case EventConst.EVENTTYPE_PRIME_SALES:
            return "building"//PrimeSaleTypeEnum.BUILDING;
        case EventConst.EVENTTYPE_PRIME_SALES_KINGDOM_LEAGUE_PASS:
            return "seasonPass"//PrimeSaleTypeEnum.SEASON_PASS;
        case EventConst.EVENTTYPE_PRIME_SALES_EXPANSIONS:
            return "expansion"//PrimeSaleTypeEnum.EXPANSIONS;
    }
    return "no_prime_sale"//PrimeSaleTypeEnum.NO_PRIME_SALE;
}

module.exports = PrimeSaleEvent;