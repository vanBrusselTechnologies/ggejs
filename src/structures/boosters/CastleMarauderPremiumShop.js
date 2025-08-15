const Localize = require("../../tools/Localize");
const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class CastleMarauderPremiumShop extends HeroBoosterShop {
    #client;
    bonusValue = 0.9;

    /** @param {BaseClient} client*/
    constructor(client) {
        super(client, "dialog_recuit_hireMarauder", "dialog_marauderHire_copy", "dialog_buyMarauder_copy", new Good(["C2", 990]), "marauder", 6);
        this.#client = client
    }

    get durationInSeconds() {
        return 604800;
    }

    get bonus() {
        return Localize.text(this.#client, "value_percentage", (this.bonusValue * 100).toString());
    }

    get listSortPriority() {
        return 670
    }

    renewText() {
        return Localize.text(this.#client, "dialog_booster_renew_generic", Localize.text(this.#client, "marauder"));
    }

    get iconMcClass() {
        return "char_marauder_normal"
    }

    get effectIconId() {
        return "icon_moreloot"
    }
}

module.exports = CastleMarauderPremiumShop