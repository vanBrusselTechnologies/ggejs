const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class XPBooster extends HeroBoosterShop {
    /** @param {Client} client*/
    constructor(client) {
        super(client, "titleID", "shortInfoTextID", "buyQuestionTextID", new Good(client, ["C2", 0]), "heroName", 21, 1);
    }
}

module.exports = XPBooster