const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class KhanTabletBoosterShop extends HeroBoosterShop {
    /** @param {BaseClient} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(["C2", 0]), "heroName", 20, 1);
    }
}

module.exports = KhanTabletBoosterShop