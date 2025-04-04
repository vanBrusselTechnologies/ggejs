const Localize = require("../../tools/Localize");
const CastlePremiumMarketShop = require("./CastlePremiumMarketShop");

class HeroBoosterShop extends CastlePremiumMarketShop {
    endTime = new Date()
    level = 0
    bonusValue = 0

    /**
     * @param {Client} client
     * @param {string} titleId
     * @param {string} shortInfoTextId
     * @param {string} buyQuestionTextId
     * @param {Good} costs
     * @param {string} heroName
     * @param {number} boosterId
     * @param {number} minLevel
     */
    constructor(client, titleId, shortInfoTextId, buyQuestionTextId, costs, heroName, boosterId, minLevel = 0) {
        super(client, titleId, shortInfoTextId, buyQuestionTextId, costs, minLevel);
        this.heroNameId = heroName;
        this.heroName = Localize.text(client, this.heroNameId);
        this.boosterId = boosterId;
    }

    static get rebuyBonusFactor() {
        return 0.9;
    }

    get durationInSeconds() {
        return 0;
    }

    /** @param {number} time*/
    parseDuration(time) {
        this.endTime = new Date(Date.now() + time * 1000);
    }

    get remainingTimeInSeconds(){
        return Math.max(0, this.endTime.getTime() - Date.now());
    }

    get isActive(){
        return this.remainingTimeInSeconds > 0
    }

    get id() {
        if (this.boosterId < 0) throw new Error("set right id in super constructor");
        return this.boosterId;
    }

}

module.exports = HeroBoosterShop