const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class CastlePrimeDayBoostWoodPremiumShop extends HeroBoosterShop {
    /** @param {BaseClient} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(["C2", 0]), "heroName", 13, 1);
    }
}

module.exports = CastlePrimeDayBoostWoodPremiumShop