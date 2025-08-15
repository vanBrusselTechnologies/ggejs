const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class GallantryPointsBooster extends HeroBoosterShop {
    /** @param {BaseClient} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(["C2", 0]), "heroName", 24, 1);
    }
}

module.exports = GallantryPointsBooster