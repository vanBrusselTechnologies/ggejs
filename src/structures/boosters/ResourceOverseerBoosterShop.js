const Localize = require("../../tools/Localize");
const HeroBoosterShop = require("./HeroBoosterShop");
const Good = require("../Good");

class ResourceOverseerBoosterShop extends HeroBoosterShop {
    #client;

    // TODO: assetType is type GameAssetType instead of string
    /**
     * @param {Client} client
     * @param {string} assetType
     * @param {number} boostId
     * @param {number} listSortPriority
     * @param {string | null} restrictedFeature
     * @param {number} boostValue
     * @param {number} boostCostValue
     */
    constructor(client, assetType, boostId, listSortPriority = 0, restrictedFeature = null, boostValue = 25, boostCostValue = 625) {
        super(client, "dialog_resourcesBoost_hireOverseer", `overseer_${assetType/*todo .balancingName*/}_copy_short`, "dialog_buyResourceBoost_copy", new Good(client, ["C2", boostCostValue]), "overseer",boostId);
        this.#client = client
        this.assetType = assetType;
        this.boostValue = boostValue;
        this.restrictedFeature = restrictedFeature;
    }

    get durationInSeconds() {
        return 604800;
    }

    get bonus() {
        return Localize.text(this.#client, "value_percentage", this.boostValue.toString());
    }

    get listSortPriority() {
        return 630
    }

    renewText() {
        return Localize.text(this.#client, "dialog_buyResourceBoost2_copy");
    }

    get iconMcClass() {
        return "char_overseer_normal"
    }

    get effectIconId() {
        return `icon_productivity_${this.assetType/*todo .balancingName*/}_booster`;
    }

    get iconBoosterClass() {
        return `icon_overseer_resource_${this.assetType/*todo .balancingName*/}`;
    }
}

module.exports = ResourceOverseerBoosterShop