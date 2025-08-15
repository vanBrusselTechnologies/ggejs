const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const ResourceOverseerBoosterShop = require("../boosters/ResourceOverseerBoosterShop");

class RebuyMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.boosterId = parseInt(metaArray[0]);
        this.senderName = Localize.text(client, "dialog_messages_system");
        const booster = client.clientUserData.boostData.getBoosterById(this.boosterId)
        const isActive = booster.isActive
        const subject = isActive ? "dialog_rebuy_mailHeader" : "dialog_overseerExpired_mailHeader";
        const description = isActive ? "dialog_overseerExpireSoon_copyGen" : "dialog_overseerExpired_copyGen";
        const boosterName = getBoosterName(client, booster);
        this.subject = Localize.text(client, subject, boosterName);
        this.description = Localize.text(client, description, boosterName);
    }
}

/**
 * @param {BaseClient} client
 * @param {HeroBoosterShop} booster
 * @return {string}
 */
function getBoosterName(client, booster) {
    const heroName = Localize.text(client, booster.heroNameId);
    if (booster instanceof ResourceOverseerBoosterShop) {
        const assetType = Localize.text(client, booster.assetType/*todo: .balancingName*/);
        return Localize.text(client, "value_with_braces", heroName, assetType);
    } else {
        return heroName;
    }
}

module.exports = RebuyMessage;