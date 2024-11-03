const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class CastlePrimeDayBoostStonePremiumShop extends HeroBoosterShop {
    /** @param {Client} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(client, ["C2", 0]), "heroName", 14, 1);
    }
}

module.exports = CastlePrimeDayBoostStonePremiumShop