const Localize = require("../../tools/Localize");

class CastlePremiumMarketShop {
    #client;
    shopTypes = [];
    continuousPurchaseCount = 0;

    /**
     * @param {BaseClient} client
     * @param {string} titleId
     * @param {string} shortInfoTextId
     * @param {string} buyQuestionTextId
     * @param {Good} costs
     * @param {number} minLevel
     */
    constructor(client, titleId, shortInfoTextId, buyQuestionTextId, costs, minLevel = 0) {
        this.#client = client
        this.titleStringId = titleId;
        this.shortInfoTextId = shortInfoTextId;
        this.costs = costs;
        this.buyQuestionTextId = buyQuestionTextId;
        this.minLevel = minLevel;
    }

    get title() {
        return Localize.text(this.#client, this.titleStringId);
    }

    get shortInfoText() {
        return Localize.text(this.#client, this.shortInfoTextId);
    }

    get buyQuestionText() {
        if (!this.isActive) {
            return Localize.text(this.#client, this.buyQuestionTextId);
        }
        return this.renewText();
    }

    renewText() {
        this.#client.logger.w(`missing renew text id for: ${this.titleStringId} shop type: ${this.shopTypes.toString()}`);
        return "";
    }

    get isVisible() {
        return true
    }

    get isActive() {
        return false
    }

    get bonus() {
        return "+ 0%";
    }

    get listSortPriority() {
        return 655
    }

    get iconMcClass() {
        return ""
    }

    get effectIconId() {
        return ""
    }
}

module.exports = CastlePremiumMarketShop;