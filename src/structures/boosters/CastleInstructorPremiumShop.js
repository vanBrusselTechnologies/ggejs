const Localize = require("../../tools/Localize");
const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class CastleInstructorPremiumShop extends HeroBoosterShop {
    #client;

    bonusValue = 0.8;

    /** @param {Client} client*/
    constructor(client) {
        super(client, "instructor_title", "instructor_copy_short", "dialog_buyInstructor_copy", new Good(client, ["C2", 990]), "instructor", 10);
        this.#client = client
    }

    get durationInSeconds() {
        return 604800;
    }

    get bonus() {
        return Localize.text(this.#client, "value_percentage", "80");
    }

    get listSortPriority() {
        return 660
    }

    renewText() {
        return Localize.text(this.#client, "dialog_booster_renew_generic", Localize.text(this.#client, "instructor"));
    }

    get iconMcClass() {
        return "char_drillinstructor_normal"
    }

    get effectIconId() {
        return "icon_productivity_units"
    }
}

module.exports = CastleInstructorPremiumShop