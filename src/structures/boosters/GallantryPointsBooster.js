const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class GallantryPointsBooster extends HeroBoosterShop {
    /** @param {Client} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(client, ["C2", 0]), "heroName", 24, 1);
    }
}

module.exports = GallantryPointsBooster