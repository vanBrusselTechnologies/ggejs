const Localize = require("../../tools/Localize");
const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class CastleTaxCollectorPremiumShop extends HeroBoosterShop {
    #client;

    /** @param {BaseClient} client*/
    constructor(client) {
        super(client, "bribe_taxcollector", "bribe_taxcollector_copy", "dialog_bribetaxcollector_copy", new Good(["C2", 750]), "taxcollector", 8);
        this.#client = client
    }

    get durationInSeconds() {
        return 604800;
    }

    get bonus() {
        return Localize.text(this.#client, "value_percentage", "20");
    }

    get listSortPriority() {
        return 655
    }

    renewText() {
        return Localize.text(this.#client, "dialog_bribetaxcollector2_copy");
    }

    get iconMcClass() {
        return "char_taxcollector_normal"
    }

    get effectIconId() {
        return "icon_currency_currency1"
    }
}

module.exports = CastleTaxCollectorPremiumShop