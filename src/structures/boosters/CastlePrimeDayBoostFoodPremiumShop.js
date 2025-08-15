const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class CastlePrimeDayBoostFoodPremiumShop extends HeroBoosterShop {
    /** @param {BaseClient} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(["C2", 0]), "heroName", 15, 1);
    }
}

module.exports = CastlePrimeDayBoostFoodPremiumShop