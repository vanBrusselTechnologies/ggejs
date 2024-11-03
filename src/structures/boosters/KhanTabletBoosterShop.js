const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class KhanTabletBoosterShop extends HeroBoosterShop {
    /** @param {Client} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(client, ["C2", 0]), "heroName", 20, 1);
    }
}

module.exports = KhanTabletBoosterShop