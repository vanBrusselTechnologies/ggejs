const ActiveEvent = require("./ActiveEvent");

class ShoppingCartEvent extends ActiveEvent {
    /** @type {number} */
    costC2;
    /** @type {number[]} */
    typeIDs;
    /** @type {number} */
    limit;
    /** @type {number} */
    paidC2;
    /** @type {number} */
    skinId;
    /** @type {number} */
    level;
    /** @type {number} */
    lifeTimeSpent;
    /** @type {boolean} */
    useSpent90Days;
    /** @type {number} */
    spent90Days;
    /** @type {number} */
    cartsPaid;

    /**
     * @param {BaseClient} client
     * @param {{EID: number, RS: number, P: number, LTS: number, SND: number, L: number, SC: [], SKN: number, C2: number, TID: number[], LIM: number, UNDS: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.costC2 = data["C2"];
        this.typeIDs = data["TID"];
        this.limit = data["LIM"];
        this.paidC2 = data["P"];
        this.skinId = data["SID"] ?? 1 /* TODO: PrimeDayShoppingCartSkinEnum.DEFAULT.id*/;
        this.level = data["L"];
        this.lifeTimeSpent = data["LTS"];
        this.useSpent90Days = data["UNDS"] !== 0;
        this.spent90Days = data["SND"];
    }

    get amountPaidForCurrentRewardTier() {
        return this.paidC2 - this.costC2 * this.rewardCount;
    }

    get rewardCount() {
        return this.paidC2 / this.costC2;
    }

    get offersHubType() {
        return {name: "primeDayShoppingCart", id: 4}// TODO: OffersHubTypeEnum.PRIME_DAY_SHOPPING_CART;
    }
}

module.exports = ShoppingCartEvent;