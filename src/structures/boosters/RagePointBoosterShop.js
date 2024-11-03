const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class RagePointBoosterShop extends HeroBoosterShop {
    /** @param {Client} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(client, ["C2", 0]), "heroName", 27, 1);
    }
}

module.exports = RagePointBoosterShop