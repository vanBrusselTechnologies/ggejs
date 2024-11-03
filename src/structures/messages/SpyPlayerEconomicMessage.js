const BasicSpyPlayerMessage = require("./BasicSpyPlayerMessage");
const Localize = require("../../tools/Localize");

class SpyPlayerEconomicMessage extends BasicSpyPlayerMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.canBeForwarded = true;
        this.initSubject(client, Localize.text(client, "dialog_attack_spyInfo"));
    }
}

module.exports = SpyPlayerEconomicMessage;