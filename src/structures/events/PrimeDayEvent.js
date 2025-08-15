const ActiveEvent = require("./ActiveEvent");
const {PrimeDay, PaymentReward} = require('e4k-data')
const {primeDays, paymentrewards} = require('e4k-data').data

class PrimeDayEvent extends ActiveEvent {
    /** @type {PrimeDay} */
    primeDay;
    /** @type {number} */
    boughtC2;
    /** @type {number} */
    rewardCount;
    /** @type {number} */
    rewardStage;
// TODO: PaymentRewardVO instead of {paymentReward: {}, rewards: []}
    /** @type {{paymentReward: PaymentReward, rewards: any, id: number, c2ForReward: number, bonus: number, value: number}[]} */
    rewardTiers = [];
    /** @type {number} */
    skinId;
    /** @type {number} */
    subType;

    resetTiers() {
        this.rewardTiers = [];
    }

    /**
     * @param {{paymentReward: PaymentReward, rewards: any, id: number, c2ForReward: number, bonus: number, value: number}} value
     * @private
     */
    addRewardTier(value) {
        if (this.hasReward(value)) return;
        this.rewardTiers.push(value);
    }

    /**
     * @param {number} tierId
     * @return {{paymentReward: PaymentReward, rewards: any, id: number, c2ForReward: number, bonus: number, value: number}}
     */
    getRewardTier(tierId)// : PaymentRewardVO
    {
        return this.rewardTiers[tierId];
    }

    /** @return {number} */
    get minLevel() {
        return this.primeDay.minLevel;
    }

    /** @return {number} */
    get maxLevel() {
        return this.primeDay.maxLevel;
    }

    /**
     * @param {{paymentReward: PaymentReward, rewards: any, id: number, c2ForReward: number, bonus: number, value: number}} subtype
     * @return {boolean}
     */
    hasReward(subtype) {
        if (this.tierCount === 0) return false;
        let i = 0;
        while (i < this.rewardTiers.length && this.rewardTiers[i].id !== subtype.id) {
            i++;
        }
        return i < this.rewardTiers.length;
    }

    /** @return {number} */
    get rewardCap() {
        return this.primeDay.rewardCap;
    }

    /** @return {number} */
    get tierCount() {
        return this.rewardTiers.length;
    }

    /** @return {{paymentReward: PaymentReward, rewards: any, id: number, c2ForReward: number, bonus: number, value: number}} */
    get lastTier() {
        return this.rewardTiers[this.tierCount - 1];
    }

    get offersHubType() {
        return {name: "primeDayEvent", id: 6}// TODO: OffersHubTypeEnum.PRIME_DAY_EVENT;
    }

    /**
     * @param {BaseClient} client
     * @param {{EID:number, RS: number, SEID: number, SKN: number, RW: *[], BC2: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.subType = data.SEID;
        this.skinId = data.SKN;
        const primeDay = primeDays.find(pd => pd.primeDayID === data.SEID)
        const rewardTiers = data.RW.map(_ => [])// TODO: rewardJSONParser.parseRewardTiers(data.RW,true);
        const paymentRewardIds = primeDay.paymentRewardIDs.toString().split(',');
        if (rewardTiers.length !== paymentRewardIds.length) {
            client.logger.w("Reward tier count mismatch between server and items XML for prime day: " + data.SEID + "(xml says it\'s " + paymentRewardIds.length + ", server says it\'s " + rewardTiers.length + ")");
        }
        this.primeDay = primeDay;
        this.resetTiers();
        let i = 0;
        while (i < paymentRewardIds.length) {
            const paymentRewardId = parseInt(paymentRewardIds[i]);
            const rewards = rewardTiers.length > i ? rewardTiers[i] : null;
            const paymentReward = paymentrewards.find(r => r.paymentrewardID === paymentRewardId);
            const rewardTier = /*TODO: new PaymentRewardVO(paymentrewards.find(r => r.paymentrewardID === paymentRewardId), rewards);*/{
                paymentReward: paymentReward,
                rewards,
                id: paymentReward.paymentrewardID,
                c2ForReward: paymentReward.c2ForReward,
                bonus: paymentReward.shownOfferBonus,
                value: paymentReward.shownCurrencyValue
            };
            this.addRewardTier(rewardTier);
            i++;
        }
        this.boughtC2 = data.BC2;
        this.rewardCount = Math.floor(this.boughtC2 / this.lastTier.c2ForReward);
    }
}

module.exports = PrimeDayEvent;